const AutomationRule = require('../models/AutomationRule');
const { createNotification } = require('./notificationService');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');
const Ticket = require('../models/Ticket');

/**
 * 
 * @param {String} organizationId The ID of the organization
 * @param {String} moduleName Module triggering the event ('Lead', 'Deal', 'Customer', 'Activity', 'Ticket')
 * @param {String} eventType Type of event ('Created', 'Updated', 'Deleted')
 * @param {Object} document The mongoose document that triggered the event (before or after update, usually after)
 */
exports.evaluateAndExecute = async (organizationId, moduleName, eventType, document) => {
    try {
        // Find active rules matching the trigger
        const rules = await AutomationRule.find({
            organization: organizationId,
            isActive: true,
            'trigger.module': moduleName,
            'trigger.event': eventType
        });

        if (!rules || rules.length === 0) return;

        for (const rule of rules) {
            let isMatch = true;

            // Evaluate all conditions (AND logic)
            for (const condition of rule.conditions) {
                let docValue = document[condition.field];
                let condValue = condition.value;

                // Make string comparisons case-insensitive
                if (typeof docValue === 'string') docValue = docValue.toLowerCase();
                if (typeof condValue === 'string') condValue = condValue.toLowerCase();

                switch (condition.operator) {
                    case 'equals':
                        isMatch = docValue == condValue;
                        break;
                    case 'not_equals':
                        isMatch = docValue != condValue;
                        break;
                    case 'contains':
                        isMatch = docValue && docValue.includes(condValue);
                        break;
                    case 'greater_than':
                        isMatch = docValue > condValue;
                        break;
                    case 'less_than':
                        isMatch = docValue < condValue;
                        break;
                    default:
                        isMatch = false;
                }

                if (!isMatch) break; // One condition failed, skip this rule
            }

            // Execute Actions if matched
            if (isMatch) {
                for (const action of rule.actions) {
                    await executeAction(moduleName, document, action, organizationId);
                }
            }
        }
    } catch (error) {
        console.error('Automation Execution Error:', error);
    }
};

const executeAction = async (moduleName, document, action, organizationId) => {
    let Model;
    switch (moduleName) {
        case 'Lead': Model = Lead; break;
        case 'Deal': Model = Deal; break;
        case 'Customer': Model = Customer; break;
        case 'Activity': Model = Activity; break;
        case 'Ticket': Model = Ticket; break;
    }

    try {
        switch (action.type) {
            case 'update_field':
               if (Model) {
                   await Model.findByIdAndUpdate(document._id, {
                       [action.targetField]: action.targetValue
                   });
                   console.log(`Automation applied: Updated ${moduleName} ${document._id} field ${action.targetField} to ${action.targetValue}`);
               }
               break;

            case 'assign_user':
                if (Model) {
                    await Model.findByIdAndUpdate(document._id, {
                        assignedTo: action.targetValue
                    });
                    console.log(`Automation applied: Reassigned ${moduleName} ${document._id} to ${action.targetValue}`);
                }
                break;

            case 'create_task':
                const now = new Date();
                const dueDate = new Date();
                dueDate.setDate(now.getDate() + (action.taskTemplate.daysUntilDue || 0));

                const newTask = new Activity({
                    organization: organizationId,
                    type: 'task',
                    subject: action.taskTemplate.subject,
                    description: action.taskTemplate.description,
                    status: 'pending',
                    date: dueDate,
                    assignedTo: document.assignedTo || document.createdBy, // default assignee
                    relatedTo: {
                        onModel: moduleName,
                        id: document._id
                    },
                    createdBy: document.createdBy || document.assignedTo // Fallback
                });

                // Some models don't have createdBy/assignedTo directly, but we do our best 
                if(!newTask.createdBy) {
                   // If no creator known, this automation task might fail validation if required. 
                   // We might need to pass the req.user explicitly if we want tracking, 
                   // but for background processes, picking an org admin could work.
                   // As a workaround, we'll log it if it misses a required field.
                }

                await newTask.save();
                console.log(`Automation applied: Created Task for ${moduleName} ${document._id}`);
                break;
                
            case 'send_notification':
                if (action.targetUser) {
                    await createNotification(
                        organizationId,
                        action.targetUser,
                        action.notificationTemplate?.title || `Automation Alert: ${moduleName}`,
                        action.notificationTemplate?.message || `An automation rule was triggered for ${moduleName}.`,
                        action.notificationTemplate?.type || 'info',
                        `/${moduleName.toLowerCase()}s` // e.g. /deals
                    );
                    console.log(`Automation applied: Sent Notification to ${action.targetUser} for ${moduleName} ${document._id}`);
                }
                break;
        }
    } catch (error) {
        console.error(`Error executing action ${action.type}:`, error);
    }
};

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Calendar as CalendarIcon,
    ListFilter,
    Settings,
    Plus
} from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

export default function Calendar() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper to parse date from DD-MM-YYYY string
    const parseDate = (dateStr) => {
        if (!dateStr) return new Date();
        const [day, month, year] = dateStr.split('-').map(Number);
        if (!day || !month || !year) return new Date();
        return new Date(year, month - 1, day);
    };

    // Helper to format date to DD-MM-YYYY string
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Derived state from URL or defaults
    const urlDate = searchParams.get('date');
    const urlViewType = searchParams.get('viewType') || 'day';

    const currentDate = parseDate(urlDate);
    // Initialize mini calendar based on current date
    const [miniCalendarDate, setMiniCalendarDate] = useState(currentDate);

    // Sync mini calendar when URL date changes
    useEffect(() => {
        setMiniCalendarDate(currentDate);
    }, [urlDate]);

    const updateDate = (newDate) => {
        setSearchParams({
            date: formatDate(newDate),
            viewType: urlViewType
        });
    };

    const updateViewType = (newViewType) => {
        setSearchParams({
            date: formatDate(currentDate),
            viewType: newViewType
        });
    };

    const hours = [
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM', '10:00 PM'
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        // Previous month filler
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, type: 'prev' });
        }
        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, type: 'current' });
        }
        // Next month filler (to complete 6 rows = 42 cells)
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({ day: i, type: 'next' });
        }
        return days;
    };

    const handlePrevMonth = () => {
        setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1, 1));
    };

    const miniCalendarDays = getDaysInMonth(miniCalendarDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <Layout>
            <div className="flex bg-white overflow-hidden h-full">
                {/* Secondary Sidebar - Calendar List */}
                <div className="w-64 min-w-[16rem] border-r border-slate-200 bg-[#1a2639] text-slate-300 flex flex-col shrink-0 relative">
                    <div className="p-4">
                        <h2 className="text-white text-lg font-semibold mb-4">Calendar</h2>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-[#24344d] border-none rounded-md py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="px-2">
                        <div className="flex items-center justify-between p-2 hover:bg-[#24344d] rounded-md cursor-pointer bg-[#24344d] text-white">
                            <span className="text-sm font-medium">My Calendar</span>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full px-4 pt-8 pb-2 border-t border-slate-700 bg-[#1a2639]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-white">
                                {monthNames[miniCalendarDate.getMonth()]} {miniCalendarDate.getFullYear()}
                            </span>
                            <div className="flex space-x-1">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-700 rounded transition-colors"><ChevronLeft size={14} /></button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-700 rounded transition-colors"><ChevronRight size={14} /></button>
                            </div>
                        </div>
                        {/* Mini Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-300">
                            {miniCalendarDays.map((date, index) => (
                                <span
                                    key={index}
                                    className={`
                                    w-6 h-6 flex items-center justify-center mx-auto rounded-full cursor-pointer hover:bg-slate-700 transition-colors
                                    ${date.type !== 'current' ? 'opacity-30' : ''}
                                    ${date.type === 'current' && date.day === currentDate.getDate() && miniCalendarDate.getMonth() === currentDate.getMonth() && miniCalendarDate.getFullYear() === currentDate.getFullYear() ? 'bg-blue-600 text-white font-bold' : ''}
                                `}
                                    onClick={() => {
                                        if (date.type === 'current') {
                                            const newDate = new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), date.day);
                                            updateDate(newDate);
                                        }
                                    }}
                                >
                                    {date.day}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Calendar Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
                    <Navbar hideTitle={true} />
                    {/* Header Toolbar */}
                    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-lg font-semibold text-slate-800">My Calendar</h1>
                        </div>

                        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => updateViewType('day')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${urlViewType === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => updateViewType('week')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${urlViewType === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => updateViewType('month')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${urlViewType === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                Month
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex bg-blue-600 text-white rounded-md overflow-hidden shadow-sm hover:bg-blue-700 transition-colors">
                                <button className="px-4 py-2 text-sm font-medium">Create</button>
                                <div className="w-px bg-blue-500"></div>
                                <button className="px-2 py-2"><ChevronDown size={14} /></button>
                            </div>
                            <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center space-x-2">
                                <span>Options</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Date Navigation & Overdue Banner */}
                    <div className="px-6 py-4 space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
                                    <CalendarIcon size={16} className="text-slate-500" />
                                    <span className="font-semibold text-lg">
                                        {currentDate.getDate()} {monthNames[currentDate.getMonth()].slice(0, 3)} <span className="text-slate-500 font-normal">{currentDate.getFullYear()} {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => {
                                    const nextDate = new Date(currentDate);
                                    nextDate.setDate(currentDate.getDate() - 1);
                                    updateDate(nextDate);
                                }} className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600"><ChevronLeft size={16} /></button>
                                <button onClick={() => {
                                    const nextDate = new Date(currentDate);
                                    nextDate.setDate(currentDate.getDate() + 1);
                                    updateDate(nextDate);
                                }} className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        {/* Overdue Banner */}
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-md flex items-center text-sm font-medium">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2 text-[10px] font-bold">!</span>
                            Overdue Activities (1)
                        </div>
                    </div>

                    {/* Time Grid (Day View) */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {/* All Day Row */}
                        <div className="flex border-b border-slate-200 py-2">
                            <div className="w-16 text-xs text-slate-500 font-medium pt-1">All Day (0)</div>
                            <div className="flex-1 min-h-[40px] border-l border-green-500 border-l-4 bg-green-50 ml-4 rounded-r-md"></div>
                        </div>

                        {/* Time Slots */}
                        <div className="mt-4 relative space-y-10">
                            {/* Current Time Indicator Mock (Red Line) - Static for demo */}
                            <div className="absolute top-[32%] w-full flex items-center z-10 pointer-events-none">
                                <div className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">06:18 PM</div>
                                <div className="h-px bg-red-500 flex-1 ml-2"></div>
                                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-red-500"></div>
                            </div>

                            {hours.map((time) => (
                                <div key={time} className="flex h-20 group relative">
                                    <span className="w-16 text-xs text-slate-500 font-medium -mt-2.5">{time}</span>
                                    <div className="flex-1 border-t border-slate-100 ml-4 h-full">
                                        {/* Half hour line (optional) */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}


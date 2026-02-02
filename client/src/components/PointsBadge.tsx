
import React from 'react';

interface PointsBadgeProps {
    points: number;
}

export const PointsBadge: React.FC<PointsBadgeProps> = ({ points }) => (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg transform transition hover:scale-105">
        <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium opacity-90">رصيدك من النقاط</p>
            <span className="bg-white/20 p-1 rounded-lg">🏆</span>
        </div>

        <h3 className="text-3xl font-extrabold mb-4">{points} <span className="text-lg font-normal opacity-80">XP</span></h3>

        <div className="mt-2">
            <div className="flex justify-between text-xs mb-1 opacity-90">
                <span>المستوى الحالي</span>
                <span>المستوى التالي</span>
            </div>
            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                    className="bg-yellow-400 h-full rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: '65%' }}
                ></div>
            </div>
            <p className="text-xs mt-2 text-yellow-100 font-medium text-center bg-white/10 py-1 rounded-md">
                🚀 أحسنت! تبعد 150 نقطة فقط عن المستوى التالي
            </p>
        </div>
    </div>
);

export default PointsBadge;

interface StatsCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
  isLoading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  }
};

export default function StatsCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  color, 
  isLoading = false 
}: StatsCardProps) {
  const colors = colorClasses[color];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span>{trend.isPositive ? '↗️' : '↘️'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 leading-tight">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
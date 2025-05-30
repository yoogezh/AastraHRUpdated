
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  Sector
} from "recharts";
import { useState } from "react";

interface StatusDistributionChartProps {
  data: Record<CandidateStatus, number>;
}

// Modern futuristic color palette with softer, lighter gradients
const COLORS = [
  '#4cc9f0', // light blue
  '#80b3ff', // soft blue
  '#b8c0ff', // lavender blue
  '#d8e2dc', // light gray
  '#ffe5d9', // soft peach
  '#ffcad4', // soft pink
  '#f4acb7', // muted pink
  '#c8b6ff', // light purple
  '#a0c4ff', // sky blue
  '#bde0fe', // baby blue
  '#e2eafc', // very light blue
];

// Enhanced 3D active shape rendering
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  // Calculate shadow positioning for 3D effect
  const shadowX = cx + 5;
  const shadowY = cy + 5;

  return (
    <g>
      {/* Shadow for 3D effect */}
      <Sector
        cx={shadowX}
        cy={shadowY}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="rgba(0,0,0,0.15)"
        className="blur-[4px]"
      />
      
      {/* Main sector with highlight effect */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-md"
        stroke="#ffffff"
        strokeWidth={1}
      />
      
      {/* Glowing inner stroke for futuristic look */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={innerRadius - 1}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="opacity-70 blur-[1px]"
      />
      
      {/* Central information display */}
      <foreignObject 
        x={cx - 60} 
        y={cy - 40} 
        width={120} 
        height={100}
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-xs text-slate-600">{payload.name}</div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            {value}
          </div>
          <div className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
            {`${(percent * 100).toFixed(0)}%`}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const handlePieClick = (_: any, index: number) => {
    // Get status from chart data
    const status = chartData[index].name;
    // Navigate to reports page with status filter
    navigate(`/reports?status=${status}`);
  };

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card className="col-span-2 hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-slate-100 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Candidate Status Distribution</span>
          <span className="text-xs font-normal text-slate-600 bg-slate-100/80 px-3 py-1 rounded-full shadow-inner">
            Click on segments for detailed reports
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80 relative">
          {/* Decorative elements for futuristic feel */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Decorative outer ring */}
              <Pie
                data={[{ name: "ring", value: 100 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={115}
                innerRadius={114}
                startAngle={0}
                endAngle={360}
                fill="rgba(203, 213, 225, 0.4)"
              />
              
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={40}
                paddingAngle={2}
                nameKey="name"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="transition-all duration-300 hover:opacity-90 drop-shadow-md"
                    style={{ 
                      filter: activeIndex === index ? 'brightness(1.2) drop-shadow(0px 0px 8px rgba(150,150,255,0.4))' : 'none' 
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} candidates`, 'Count']} 
                contentStyle={{
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{
                  color: '#334155'
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: '20px',
                  color: '#64748b'
                }}
                formatter={(value) => <span className="text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;

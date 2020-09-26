import React from 'react';
import { Line } from 'react-chartjs-2';

function lineGraph() {
    const [data, setData] = useState({});
    //https://disease.sh/v3/covid-19/historical/all?lastdays=120
    const buildChartData = (data,casesType='cases') => {
        const chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = { x: date, y: data[casesType][date] - lastDataPoint }
                chartData.push(newDataPoint);
            }
            lastDataPoint = date[casesType][date];
        }
        return chartData;
    };
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => response.json())
            .then(data => {
                    const chartData=buildChartData(data);
                    setData(chartData);
            })
    }, [])
    
    return (
        <div>
            <Line
                data={{
                    datasets:[{
                        backgroundColor:"rgba(204,16,52,0)",
                        borderColor:"#CC1034",
                        data:data
                    }]
                }}
                options />
        </div>
    )
}

export default lineGraph

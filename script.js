function processCrimes(list, sector) {
  return list.filter((item) => item.pgpd_sector === (sector));
}
function initChart(chart, object) {
  const labels = Object.keys(object);
  const info = Object.keys(object).map((item) => object[item].length);

  const data = {
    labels: labels,
    datasets: [{
      label: 'Crimes by Category',
      backgroundColor: 'black',
      borderColor: 'black',
      data: info
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {}
  };
  return new Chart(chart, config);
}
function changeChart(chart, dataObject) {
  const labels = Object.keys(dataObject);
  const info = Object.keys(dataObject).map((item) => dataObject[item].length);
  chart.data.labels = labels;
  chart.data.datasets.forEach((set) => {
    set.data = info;
    return set;
  });
  chart.update();
}

function shapeDataForBarChart(array) {
  return array.reduce((collection, item) => {
    if (!collection[item.clearance_code_inc_type]) {
      collection[item.clearance_code_inc_type] = [item];
    } else {
      collection[item.clearance_code_inc_type].push(item);
    }
    return collection;
  }, {});
}
async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json';
  const data = await fetch(url);
  const json = await data.json();
  const reply = json.filter((item) => Boolean(item.pgpd_sector));
  console.log(reply);
  return reply;
}
async function mainEvent() {
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const chartTarget = document.querySelector('#myChart');

  const chartData = await getData();

  const shapedData = shapeDataForBarChart(chartData);
  const myChart = initChart(chartTarget, shapedData);

  form.addEventListener('input', (event) => {
    sector = event.target.value;
    const filteredList = processCrimes(chartData, event.target.value);
    const localData = shapeDataForBarChart(filteredList);
    changeChart(myChart, localData);
  });

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    myChart.clear();
  });
}
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
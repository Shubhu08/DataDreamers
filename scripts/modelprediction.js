function modelRegPredict(event) {
    country = event.target.elements.modelRegCountry.value
    year = event.target.elements.modelRegYear.value
  

  var promises_model = [];
  promises_model.push(d3.csv("data/Linear_Regression_Predicted_2021_2050.csv"));

  Promise.all(promises_model).then(function (values) { 
  
    predictions = values[0]
    
    predicted = predictions.filter(d => d.Country.includes(country) & d.Time == year)
    //console.log(predicted[0].Predicted_Net_Migration)

    predicted_net_migrations = Number(predicted[0].Predicted_Net_Migration).toFixed(4);
    document.getElementById("modelRegResult").innerHTML = predicted_net_migrations
  
  });

}
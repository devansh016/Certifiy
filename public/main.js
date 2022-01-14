function getDesigns(){
	var config = {
		method: 'post',
		url: 'http://localhost/getTemplate',
	  };
	  
	  axios(config)
	  .then(function (response) {
		console.log(JSON.stringify(response.data));
		var j = 1;
		for (const element of response.data) {
			var opt = document.createElement("option")
			opt.value = j
			opt.text = element
			design.add(opt, null)
			j = j + 1
		}
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}
getDesigns()
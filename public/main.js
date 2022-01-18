function getDesigns(){
	var config = {
		method: 'post',
		url: 'http://localhost/getTemplate',
	  };
	  
	  axios(config)
	  .then(function (response) {
		console.log(JSON.stringify(response.data));
		for (const element of response.data) {
			var opt = document.createElement("option")
			opt.value = element
			opt.text = element
			design.add(opt, null)
		}
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}
getDesigns()
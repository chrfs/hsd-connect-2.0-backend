export const formatResponse = (response) => {
  if(!!response.errors || !!response.data){
    const formatedResponse = {};
    
    if(!!response.data) {
    	formatedResponse.status = 'success';
      formatedResponse.data = response.data;
    } else if(!!response.errors) {
    	formatedResponse.status = 'error';
      formatedResponse.errors = {};
    	Object.keys(response.errors).forEach((key) => {
      	formatedResponse.errors[key] = { message: response.errors[key].message};
      });
    }
  
		return formatedResponse;
	}
}
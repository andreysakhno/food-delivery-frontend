const baseUrl = "https://static.welesgard.com/delivery/frontend/web/api/";

export async function getData(endpoint, params = {}) { 
   const url = new URL(baseUrl + endpoint);

   if (params.hasOwnProperty("shopIds")) {
      url.searchParams.append("shopIds", params.shopIds.toString());
   }
   
   try {       
      const response = await fetch(url);
            
      if (!response.ok) {
         const message = `An error has occured: ${response.status} - ${response.url}`;
         throw new Error(message);
      }
      
      return await response.json();  

   } catch (error) {
      console.error(error);
   }  
}

export async function postData(endpoint, data = {}) {
   const url = new URL(baseUrl + endpoint);   
   try {
      const response = await fetch(url, {
         method: "POST",
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
      });

      if (!response.ok) {
         const message = `An error has occured: ${response.status} - ${response.url}`;
         throw new Error(message);
      }

      return await response.json();
      
   } catch (error) {
      console.error(error);
   }
}


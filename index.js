const axios = require('axios');
var defaultUrlPart = '/api/products/1'
const conversionFactor = 250
const baseUrl = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com'
const filterItem = 'Air Conditioners'
var itemCount = 0 //cumulative
var itemCubicWeight = 0 //cumulative
var hasError = false;

function computePrdAvgCuWgt(urlPart, productName)
{
    //fetch products from api
    axios.get(baseUrl + urlPart).then(resp => {
        //Loop through each product returned in response
        Object.entries(resp.data.objects).forEach(([key, value]) => 
        {
            if(value.category === productName)
            {    
                try
                {
                    itemCount++ //keep count of items to calculate average at end of call
                    itemCubicWeight += ((value.size.width / 100) * (value.size.length / 100) * (value.size.height / 100) * (conversionFactor)) //Current units are in cm, Devide by 100 to get units in meters                    
                    /* for debuging
                    console.log('\n*** ' + value.title + ' ***')
                    console.log('Width: ' + value.size.width / 100)
                    console.log('Length: ' + value.size.length / 100)
                    console.log('Height: ' + value.size.height / 100)
                    */
                }
                catch(error)
                {
                    //this can be handled better, but this is a small exercise so just making sure here if response is valid
                    hasError = true
                }
            }
        }
        );

        let nextUrlAddress = resp.data.next //Get next page url part
        if(!hasError && nextUrlAddress != null)
        {
            //Recursively fetch all products from api
            computePrdAvgCuWgt(nextUrlAddress, filterItem)
        }
        else
        {
            //Result
            hasError ? console.log('Cannot compute due to error\n') : console.log('\nComputed Average Cubic Weight for ' +filterItem+ ': ' + Math.round((itemCubicWeight / itemCount + Number.EPSILON) * 100) / 100 + ' Kg\n') //Rounding to 2 decmials            
        }
    });
}

//Initiate fetch product from api
computePrdAvgCuWgt(defaultUrlPart, filterItem)


const axios = require('axios');
var defaultUrlAddress = '/api/products/1'
const conversionFactor = 250
const apiUrl = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com'
const filterItem = 'Air Conditioners'
var itemCount = 0
var averageCubicWeight = 0

function getProducts(urlAddress)
{
    axios.get(apiUrl + urlAddress).then(resp => {

        Object.entries(resp.data.objects).forEach(([key, value]) => 
        {
            if(value.category === filterItem)
            {   itemCount++
                averageCubicWeight += ((value.size.width / 100) * (value.size.length / 100) * (value.size.height / 100) * (conversionFactor))                
                console.log('\n*** ' + value.title + ' ***')
                console.log('Width: ' + value.size.width / 100)
                console.log('Length: ' + value.size.length / 100)
                console.log('Height: ' + value.size.height / 100)
                console.log('Cubic Weight: ' + ((value.size.width / 100) * (value.size.length / 100) * (value.size.height / 100) * (conversionFactor)) + ' Kg')
                
            }
        }
        );

        let urlAddress = resp.data.next
        if(urlAddress != null)
        {
            getProducts(urlAddress)
        }
        else
        {
            console.log('\nComputed Average Cubic Weight for ' +filterItem+ ': ' + Math.round((averageCubicWeight / itemCount + Number.EPSILON) * 100) / 100 + ' Kg\n')

        }
    });
}

getProducts(defaultUrlAddress)


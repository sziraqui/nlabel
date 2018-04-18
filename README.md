# nlabel

WebApp for creating dataset of labeled images

### Usage:
Start the webapp    
`$ npm start`   
Access [localhost:3000](http://localhost:3000) from your browser      
Enter absolute path of directory of images for which labels are to be made      
Enter comma separated label names (tags) and click next     
Set label values in auto generated input fields     
Click on "Get Dataset" to downloaded dataset as csv

- Clean up script     
To create a new dataset first clear old data by running     
`$ npm run-script clean`    


### Changelog:
18/04/2018
- First release v0.0.1
- Fully functional but with least error checks

### Todos:
- Choose images directory by browsing local filesystem  
- Set filename of dataset before downloading   
- Manage user sessions to resume dataset creation 
- Customize input type of each label    
- Automatically set a default input type on basis of label name     

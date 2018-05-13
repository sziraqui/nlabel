# nlabel

WebApp for creating dataset of labeled images

### Usage:
Start the webapp    
`$ npm start`   
1. Access [localhost:3000](http://localhost:3000) from your browser      
2. Enter absolute path of directory of images for which labels are to be made      
4. Set image dimensions
4. Click "+class" to create a labeling category of object   
5. Click "+label" below a class to add a new label name-value set for that class      
6. Click "Next" to save configuration in public/data/config.json
7. You will be redirected to /gallery where you can set labels
8. Select a class from dropdown on sidebar. Label set will change according to selected class after page reloads
9. Draw bounding box over a region of interest. Set label value from drop down or enter a custom value
10. Click "Save current box". Data from bottom texarea will be written to public/data/outputs/image_name.json
11. Browse through images by pressing Next/Previous
12. If you perform any undo/redo/discard operation, you must click on "Save All" to commit changes to existing file


### Changelog:
18/04/2018
- First release v0.0.1
- Fully functional but with least error checks

13/05/2018
- Complete revamp
- Define classes and labels with their default values
- Create bounding box and label each box instead of entire image
- Save annotations of every image in a separate file
- Symlink user directory instead of individual files
- Dataset stored as .json files stored in public/data/outputs
- Store aboslute coordinates of bounding box with "location" as key and relative coordinates (wrt scaled image) with "scaled" json key


### Todos:
- Choose images directory by browsing local filesystem  
- Set filename of dataset before downloading   
- Manage user sessions to ~~resume dataset creation~~ 
- ~~Customize input type of each label~~   
- Automatically set a default input type on basis of label name     

# Find My House

Find My House is an angular project used for developer assessment. The following were implemented:
* a list of all the houses sorted according to their distance to your sisters home in Eberswalder Straße 55. Start with the house w ith the lowest distance.
* a list of houses which have more then 5 rooms. Start with the lowest number of rooms.
* a list of houses that you do not have all the data for. Sort them by the street-name.

The answer to the question can be determined by filtering the data by distance to the sister's house. Relevant information such as value and rooms are prominently displayed. If you can move with you sister at Eberswalder Straße 55, then this is the best possible answer. This is the house closest to your sister because you will be living together. The house also meets the other criteria as it has at at least 10 rooms and cost no more than €5M. However, if this is not possible, then the next option would the the house at Danziger Straße 66. This has 12 rooms, and it costs €5M. This house is also the closest house with complete information.



# User Testing and Deployment
To test the web application, simply run `ng serve` command. This will route external api requests to a proxy to circumvent Cross-Origin Resource restrictions of browsers. For deployment, this will not be a problem so long as the web application and the api are being served in the same server, otherwise, the backend must be modified to properly respond to the preflight requests of the browser.

# Unit Testing
To unit test the app component, simply run `ng test` command. This will test 3 things:
* Checks dependencies and imports needed for the component to work.
* Checks if the h1 tag is 'Our Home'
* Checks if the computed distance is correct using the Haversine formula.


# Documentation
The code is annotated using JSDoc for better understandability. This can be parsed using tsdoc parser.

# Copyright Issues
I do not own the background image. This image is available at  [Jeffrey Czum](https://www.pexels.com/photo/four-colourful-houses-2501965/) photo portfolio. According to the licensing policy of Pexel, "Attribution is not required. Giving credit to the photographer or Pexels is not necessary but always appreciated." For further information, please visit the licensing policy website of [Pexel](https://www.pexels.com/photo-license/).

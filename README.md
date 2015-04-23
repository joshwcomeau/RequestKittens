Emoticat
========
The only API ridiculous enough to let you find cats by emotion.
--------------------------


#####ENDPOINTS

Pretty straightforward: Standard RESTful interface for a 'cat' model. 


######INDEX - Get /cats
  
returns a bunch of cats. By default, they aren't categorized by emotion.

For image_size: 

* thumb:  200x200px square image, cropped in the center
* medium: 500px wide, with the original image's aspect ratio preserved (varying heights)
* large:  1000px wide, same aspect ratio
* full:   Whatever the original image's size is

**REQUEST:**

```
FIELD             ACCEPTED VALUES       REQUIRED          DEFAULT
emotion           see '/emotion'        false             null
format            json / xml / src      false             'json'
num_of_results    1-100                 false             10
image_size        see above             false             'medium'       

*example: /cats?emotion=grumpy&num_of_results=25&image_size=large*
```

To authorize: api_key should be sent as a header.


**RESPONSE:**
returns an array of cats with the following details:

```
[
  {
    id:       6,
    emotion:  'grumpy',
    url:      'http://www.cat.com/cat.png'
  }, ...
]
```

######SHOW - get /cats/:id
  returns details on a single cat photo.

  example: /cats/5

  **RESPONSE:**
  Returns a single cat object, identical to Index.


######CREATE - post /cats
  creates a new cat with the supplied data. Not sure yet but Im thinking it'll take multipart image form data.

  **RESPONSE:**
  Will return the newly created cat object with its ID


######UPDATE - patch/put /cats/:id
  edits a pre-existing cat.

  **RESPONSE:**
  Will return the cat object.

######DELETE - delete /cats/:id
  Exactly what you'd think.

  **RESPONSE:**
  Returns a confirmation.

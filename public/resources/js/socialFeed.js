
$(document).ready(function(){
    $('.social-feed-container').socialfeed({
        // INSTAGRAM
        twitter:{
            accounts: ['@searchhomeless','#searchhomeless'],  //Array: Specify a list of accounts from which to pull posts
            limit: 2,                                    //Integer: max number of posts to load
            consumer_key: "qGPbXBBj6cbDHy4k9DQ1e5STp",       //String: Instagram client id (optional if using access token)
            consumer_secret: "IZri5Ib4tRnPUjjPjEuZNyisLi0uyBhhBS7FPxWD7LBzLwRVu0" //String: Instagram access token
        },
        facebook: {
          accounts: ['@searchhomelessservices', '#searchhomeless'],
          limit: 2,
          access_token: "288966444828474|teIFmtQGn2iWDYeyIu5ytD3fhxk"
        },

        // GENERAL SETTINGS
        length:200,
        show_media: true                                    //Integer: For posts with text longer than this length, show an ellipsis.
    });
});

//using a RESTful API to serve calls to API keys

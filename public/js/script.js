$(document).ready(function(){

    // to hover and focus nav-links 
      var url = window.location;
 
     
      // Will only work if string in href matches with location

          $('ul li a[href="' + url + '"]').parent().addClass('active');
          
      // Will also work for relative and absolute hrefs
          $('ul li a').filter(function () {
              return this.href == url;
          }).parent().addClass('active').parent().parent().addClass('active');



    // for proper working of dropdown
        $(".dropdown-toggle").dropdown();

        
    // to fade out nab=vbar on scroll
        window.addEventListener("scroll", function() {
            if (window.scrollY > 80) {
                // $('.navbar').fadeOut();
                $('.indexPage .navbar').addClass("n-bg");
                $('.indexPage .navbar a').addClass("n-text");
                $('.indexPage #collapsingNavbar').css('background','none');

                $('.indexPage .fa-times,.indexPage .fa-bars').css('color','#000');
               
                



                
            }
            else {
                // $('.navbar').fadeIn();
                $('.indexPage .navbar').removeClass("n-bg");
                $('.indexPage .navbar a').removeClass("n-text");
                $('.indexPage #collapsingNavbar').css('background',' rgba(0,0,0,0.8)')

                $('.indexPage .fa-times,.indexPage .fa-bars').css('color','#fff')

            }
        },false);
    

    // event
        $('.event-container').slick({
            infinite:false,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplaySpeed: 2000,
            nextArrow:$(".next-event"),
            prevArrow:$(".prev-event"),
            // variableWidth: true,
            adaptiveHeight: true,
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                  }
                },
                {
                  breakpoint: 900,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                    breakpoint: 800,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                    }
                  },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
              ]
        });
        
       
      
    // post carousel
        $('.post-wrapper').slick({
            
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            nextArrow:$(".next"),
            prevArrow:$(".prev"),
            // variableWidth: true,
            adaptiveHeight: true,
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    
                  }
                },
                {
                    breakpoint: 800,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 2
                    }
                  },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
              ]
        });


        // modal for video show in gallery page

        $('#modal1').on('hidden.bs.modal', function (e) {
          // do something...
          $('#modal1 iframe').attr("src", $("#modal1 iframe").attr("src"));
        });
        
        $('#modal6').on('hidden.bs.modal', function (e) {
          // do something...
          $('#modal6 iframe').attr("src", $("#modal6 iframe").attr("src"));
        });
        
        $('#modal4').on('hidden.bs.modal', function (e) {
          // do something...
          $('#modal4 iframe').attr("src", $("#modal4 iframe").attr("src"));
        });





        // to toggle update image in /edit
        $("#deleteButton").click(function(){
          $(".deleteButton").fadeToggle();
        });
        
        

});

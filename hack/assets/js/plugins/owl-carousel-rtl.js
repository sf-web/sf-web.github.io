var OwlCarousel = function () {
    return {
        //Owl Carousel
        initOwlCarousel: function () {		 
            //Owl Twitter v1
            jQuery(".owl-twitter-v1").owlCarousel({
                loop: true,
                rtl: true,
                nav: false,
                dots: true,
                smartSpeed : 750,
                autoplayHoverPause : 10000,
                dotsClass: "owl-pagination",
                dotClass: "owl-page",
                responsive: {
                    0:{
                        items: 1
                    }
                }
            });


            //Owl Testimonials v1
            jQuery(".owl-ts-v1").owlCarousel({
                loop: true,
                rtl: true,
                margin: 10,
                responsive: {
                    0:{
                        items: 1
                    }
                },
                navText: [,],
                nav: true,
                dots: false,
                navContainerClass: "owl-buttons",
            });
            jQuery(".next-v1").click(function(){
                jQuery(".owl-next").trigger('next.owl.carousel');
            })
            jQuery(".prev-v1").click(function(){
                jQuery(".owl-prev").trigger('prev.owl.carousel');
            })


            //Owl Clients v2
            jQuery(".owl-clients-v2").owlCarousel({
                loop: true,
                rtl: true,
                nav: false,
                dots: false,
                responsive: {
                    0:{
                        items: 1
                    },
                    600:{
                        items: 3
                    },
                    900:{
                        items: 4
                    },
                    1000:{
                        items: 5
                    }
                }
            });
		}
    };
}();
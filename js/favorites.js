var APILinkPokemon = "https://pokeapi.co/api/v2/pokemon/";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initializeSlick() {
    $('#block-details-slick').slick({
        slidesToShow: 1,
        infinite: true,
        autoplay: true,
        arrows: true,
        dots: false,
        autoplaySpeed: 2500,
        prevArrow: '<button type="button" class="slick-prev-arrow"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next-arrow"><i class="fas fa-chevron-right"></i></button>',
    });
}

$(document).ready(function(){

    function showFavorites() {
        $('.block-list-box-message').removeClass("active");
        if(document.cookie != "empty"){
            var cookies = [];
            cookies = document.cookie.split(",");
            for (var i = 0; i < cookies.length; i++) {
                (function(pokemon) {
                    $.ajax(APILinkPokemon + pokemon, {
                        success: function(data) {
                            const pokemonsData = data;
                            $('.block-list-box').append(`<div class="block-list-box-pokemon" id="${pokemon}-container"></div>`);
                            if (pokemonsData.sprites.front_default) {
                                $(`#${pokemonsData.name}-container`).append(`<button class="block-list-box-pokemon-button ${pokemonsData.name}"><img src="${pokemonsData.sprites.front_default}"> <h1>${pokemonsData.id} - ${capitalizeFirstLetter(pokemonsData.name)}</h1></button>`);
                            } else {
                                $(`#${pokemonsData.name}-container`).append(`<button class="block-list-box-pokemon-button ${pokemonsData.name}"><img src="img/camera.png"> <h1>${pokemonsData.id} - ${capitalizeFirstLetter(pokemonsData.name)}</h1></button>`);
                            }
                        }
                    });
                })(cookies[i]);
            }
        } else {
            $('.block-list-box-message').addClass("active");
        }
    }

    function loadPokemonDetails(pokemonData, pokemon) {

        if (document.cookie){

            var cookies = [];

            cookies = document.cookie.split(",");
        

            if (cookies.includes(pokemon)){
                $(`.block-details-header-button`).addClass('active');
            }

            $('.block-details-header-button').off('click').click(function() {
                if ($(this).attr('class').includes("active")){
                    $(this).removeClass('active');
                    cookies.splice(cookies.indexOf(pokemon), 1);
                    if(cookies.length != 0){
                        document.cookie = cookies;
                    } else {
                        document.cookie = "empty";
                    }
                    
                    setTimeout(function() {
                    location.reload();
                    }, 500);
                }
            });
        }

        $('.block-details-header h1').remove();
        $('.block-details-header .pokemon-icon').remove();
        $('.block-details-header').append(`<h1 class="block-details-name-pokemon">${pokemonData.id} - ${capitalizeFirstLetter(pokemonData.name)}</h1>`);

        var pokemonType = pokemonData.types.map(type => type.type.name);
        pokemonType.forEach(type => {
            $('.block-details-header').append(`<img class="pokemon-icon" src="img/icons/${type}.svg" width="6%">`);
        });

        if ($('#block-details-slick').hasClass('slick-initialized')) {
            $('#block-details-slick').slick('unslick');
        }

        $('#block-details-slick').empty();
        if (pokemonData.sprites.front_default) {
            $('#block-details-slick').append(`<div><img class="block-details-image-pokemon" src="${pokemonData.sprites.front_default}" alt="Slide 1"></div>`);
        }
        if (pokemonData.sprites.back_default) {
            $('#block-details-slick').append(`<div><img class="block-details-image-pokemon" src="${pokemonData.sprites.back_default}" alt="Slide 2"></div>`);
        }
        if (pokemonData.sprites.front_shiny) {
            $('#block-details-slick').append(`<div><img class="block-details-image-pokemon" src="${pokemonData.sprites.front_shiny}" alt="Slide 3"></div>`);
        }
        if (pokemonData.sprites.back_shiny) {
            $('#block-details-slick').append(`<div><img class="block-details-image-pokemon" src="${pokemonData.sprites.back_shiny}" alt="Slide 4"></div>`);
        }

        initializeSlick();

        const moves = pokemonData.moves.slice(0, 3).map(move => move.move.name);
        $('.block-details-info-attacks-list').empty();
        moves.forEach(move => {
            $('.block-details-info-attacks-list').append(`<li>${capitalizeFirstLetter(move)}</li>`);
        });

        $.ajax(pokemonData.species.url, {
            success: function(data) {
                $.ajax(data.evolution_chain.url, {
                    success: function(evolutionData) {
                        var evolutions = [];
                        var current = evolutionData.chain;
                        while (current) {
                            evolutions.push(current.species.name);
                            current = current.evolves_to[0];
                        }
                        $('.block-details-info-evolutions-list').empty();
                        evolutions.forEach(evolution => {
                            $('.block-details-info-evolutions-list').append(`<li>${capitalizeFirstLetter(evolution)}</li>`);
                        });
                    }
                });
            }
        });

        $('.block-details').addClass('active');
        $('.overlay').addClass('active');
    }

    $('.block-list-box').on('click', '.block-list-box-pokemon-button', function() {
        var classNames = $(this).attr('class').split(" ");
        var pokemon = classNames[1];
        $.ajax(APILinkPokemon + pokemon, {
            success: function(data) {
                loadPokemonDetails(data, pokemon);
            }
        });
    });

    $('.block-list-box').on('click', '.block-list-box-pokemon-button', function() {
        var classNames = $(this).attr('class').split(" ");
        var pokemon = classNames[1];
        $.ajax(APILinkPokemon + pokemon, {
            success: function(data) {
                loadPokemonDetails(data, pokemon);
            }
        });
    });

    $('.overlay').click(function() {
        $('.block-details-header h1').remove();
        $('.block-details-header .pokemon-icon').remove();
        $('img.block-details-image-pokemon').remove();
        $('.block-details-info-attacks-list').empty();
        $('.block-details-info-evolutions-list').empty();
        $('.block-details').removeClass('active');
        $('.overlay').removeClass('active');
    });

    initializeSlick();
    showFavorites();

});

function clearDocument(){
    $('.block-list-box').html(null)
}

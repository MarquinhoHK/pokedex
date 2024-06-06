var APILink = "https://pokeapi.co/api/v2/pokemon/?limit=9";
var APILinkPokemon = "https://pokeapi.co/api/v2/pokemon/";
var nextPage = null;
var prevPage = null;
var lastPage = null;

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

    function clearDocument() {
        $('.block-list-box').html('');
    }

    function loadPokemonDetails(pokemonData, pokemon) {
        
        var cookies = [];

        if (document.cookie != "empty" && document.cookie.length != 0){
            cookies = document.cookie.split(",");
        }

        if (cookies.includes(pokemon)){
            $(`.block-details-header-button`).addClass('active');
        } else {
            $(`.block-details-header-button`).removeClass('active');
        }

        $('.block-details-header-button').off('click').click(function() {
            if ($(this).attr('class').includes("active")){
                $(this).removeClass('active');
                cookies.splice(cookies.indexOf(pokemon), 1);
            } else {
                $(this).addClass('active');
                cookies.push(pokemon);
            }
            if(cookies.length != 0){
                document.cookie = cookies;
            } else {
                document.cookie = "empty";
            }
        });

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

    $('.block-list-box-button.first').click(function() {
        clearDocument();
        $.ajax(APILink + "&offset=" + 0, {
            success: function(data) {
                const pokemonsData = data.results;
                nextPage = data.next;
                prevPage = data.previous;
                pokemonsData.forEach(element => {
                    $('.block-list-box').append(`<div class="block-list-box-pokemon" id="${element.name}-container"></div>`);
                    $.ajax(element.url, {
                        success: function(data) {
                            if(data.sprites.front_default){
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="${data.sprites.front_default}"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            } else {

                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="img/camera.png"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            }
                        }
                    });
                });
            }
        });
    });

    $('.block-list-box-button.prev').click(function() {
        if (!prevPage) {
            return;
        }
        clearDocument();
        $.ajax(prevPage, {
            success: function(data) {
                const pokemonsData = data.results;
                nextPage = data.next;
                prevPage = data.previous;
                pokemonsData.forEach(element => {
                    $('.block-list-box').append(`<div class="block-list-box-pokemon" id="${element.name}-container"></div>`);
                    $.ajax(element.url, {
                        success: function(data) {
                            if(data.sprites.front_default){
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="${data.sprites.front_default}"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            } else {
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="img/camera.png"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            }
                        }
                    });
                });
            }
        });
    });

    $('.block-list-box-button.next').click(function() {
        if (!nextPage) {
            return;
        }
        clearDocument();
        $.ajax(nextPage, {
            success: function(data) {
                const pokemonsData = data.results;
                nextPage = data.next;
                prevPage = data.previous;
                pokemonsData.forEach(element => {
                    $('.block-list-box').append(`<div class="block-list-box-pokemon" id="${element.name}-container"></div>`);
                    $.ajax(element.url, {
                        success: function(data) {
                            if(data.sprites.front_default){
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="${data.sprites.front_default}"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            } else {
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="img/camera.png"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            }
                        }
                    });
                });
            }
        });
    });

    $('.block-list-box-button.last').click(function() {
        if (!lastPage) {
            return;
        }
        clearDocument();
        $.ajax(APILink + "&offset=" + lastPage, {
            success: function(data) {
                const pokemonsData = data.results;
                nextPage = data.next;
                prevPage = data.previous;
                pokemonsData.forEach(element => {
                    $('.block-list-box').append(`<div class="block-list-box-pokemon" id="${element.name}-container"></div>`);
                    $.ajax(element.url, {
                        success: function(data) {
                            if(data.sprites.front_default){
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="${data.sprites.front_default}"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            } else {
                                $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="img/camera.png"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                            }
                        }
                    });
                });
            }
        });
    });

    $.ajax(APILink, {
        success: function(data) {
            const pokemonsData = data.results;
            nextPage = data.next;
            prevPage = data.previous;
            lastPage = Number(data.count) - 9;
            pokemonsData.forEach(element => {
                $('.block-list-box').append(`<div class="block-list-box-pokemon" id="${element.name}-container"></div>`);
                $.ajax(element.url, {
                    success: function(data) {
                        if(data.sprites.front_default){
                            $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="${data.sprites.front_default}"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                        } else {
                            $(`#${data.name}-container`).append(`<button class="block-list-box-pokemon-button ${data.name}"><img src="img/camera.png"> <h1>${data.id} - ${capitalizeFirstLetter(data.name)}</h1></button>`);
                        }
                    }
                });
            });
        }
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
});

function clearDocument(){
    $('.block-list-box').html(null)
}
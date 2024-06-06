$(document).ready(function(){

    var APILink = "https://pokeapi.co/api/v2/pokemon/";

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getRandomInt() {
        min = Math.ceil(1);
        max = Math.floor(649);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $('.block-search-box-form').on('submit', function(event) {
        event.preventDefault();
        console.log($('.block-search-box-form-input').val().toLowerCase())
        showPokemon($('.block-search-box-form-input').val().toLowerCase());
        $('.block-search-box-form-input').val('');
    });

    function showPokemon(pokemon) {
        $('.block-search-display-id-name').html("A procurar...");
        $('.block-search-display-id-number').html("");
        $('.block-search-display-image-pokemon').attr('src', "");
        $('.block-search-display-info-list').html("");

        $.ajax({
            url: APILink + pokemon,
            success: function(data) {
                const pokemonData = data;
                var pokemonName = pokemonData.name;
                $('.block-search-display-id-name').html(pokemonData.id);
                $('.block-search-display-id-number').html(capitalizeFirstLetter(pokemonData.name));
                $('.block-search-display-image-pokemon').attr('src', pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default);
                $('.block-search-display-info-list').html("");    
                const moves = pokemonData.moves.slice(0, 3).map(move => move.move.name);
                $('.block-search-display-info-list').empty();
                moves.forEach(move => {
                    $('.block-search-display-info-list').append(`<li>${capitalizeFirstLetter(move)}</li>`);
                });
                var cookies = [];

                if (document.cookie != "empty" || document.cookie != ""){
                    cookies = document.cookie.split(",");
                }

                if (cookies.includes(pokemonName)){
                    $(`.block-search-display-id-button`).addClass('active');
                } else {
                    $(`.block-search-display-id-button`).removeClass('active');
                }

                $('.block-search-display-id-button').off('click').click(function() {
                    if ($(this).attr('class').includes("active")){
                        $(this).removeClass('active');
                        cookies.splice(cookies.indexOf(pokemonName), 1);
                    } else {
                        $(this).addClass('active');
                        cookies.push(pokemonName);
                    }
                    if(cookies.length != 0){
                        document.cookie = cookies;
                    } else {
                        document.cookie = "empty";
                    }
                });
            },
            error: function() {
                $('.block-search-display-id-name').html("Pokemon não existe");
                $('.block-search-display-id-number').html("");
                $('.block-search-display-image-pokemon').attr('src', "");
                $('.block-search-display-info-list').html("");
                $('.block-search-display-id-button').off('click');
                $(`.block-search-display-id-button`).removeClass('active');
            }
        });
    }
    showPokemon(getRandomInt());
});

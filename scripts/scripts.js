const selectors = {
    main: '.main',
    navBtn: '.nav__list-link',
    curNavBtn: '.nav__list-link--current',
    movieInstance: '.movie',
    curMovieInstance: '.movie--current',

    moveisHolder: '.main__movies .content-container',
    searchBtn: '#searchBtn',
    searchInp: '#searchInp',
    createBtn: '#createBtn',
    titleInp: '#titleInp',
    imageInp: '#imageInp',
    descriptionInp: '#descriptionInp',
    yearInp: '#yearInp',
    ratingInp: '#ratingInp',
    genresInp: '#genresInp',
    starringInp: '#starringInp',
}


class HomePageRouter {

    init() {
        this.registerEventHandlers();
    }

    registerEventHandlers() {
        this.handleNavBtnClick();
        this.handleSearchBtnClick();
        this.handleCreateBtnClick();
    }

    handleNavBtnClick() {
        const { navBtn, main, moveisHolder, curNavBtn } = selectors;
        $(navBtn).on('click', (e) => {
            $(curNavBtn).removeClass('nav__list-link--current');
            $(e.target).addClass('nav__list-link--current');
            const mainComponentId = `#${$(e.target).attr('id')}Section`;

            if (mainComponentId === '#moviesSection') {
                $(moveisHolder).find('.movie').detach();
                this.renderMovies();
            }
            $(main).children().filter(':visible').addClass('hidden');
            $(mainComponentId).removeClass('hidden');
        })
    }

    handleSearchBtnClick() {
        const { searchBtn, searchInp } = selectors;
        $(searchBtn).on('click', async (e) => {
            const year = Number($(searchInp).val());

            if (typeof year !== 'number' || 1800 > year || year > 2020) {
                notifications.showError('Input a valid year between 1800 and 2020');
                return;
            }
            this.filterMovies(year);
        })
    }

    handleCreateBtnClick() {
        const { createBtn, titleInp, imageInp, descriptionInp, yearInp, ratingInp, genresInp, starringInp } = selectors;

        $(createBtn).on('click', async (e) => {
            const movieObj = {
                title: $(titleInp).val(),
                description: $(descriptionInp).val(),
                year: Number($(yearInp).val()),
                rating: Number($(ratingInp).val()),
                genres: $(genresInp).val(),
                starring: $(starringInp).val()
            }

            if ($(imageInp).val()) {
                movieObj.imageUrl = $(imageInp).val();
            } else {
                movieObj.imageUrl = "https://cdn.onlinewebfonts.com/svg/img_77735.png";
            }

            if (!movieService.movieInputIsValid(movieObj)) {
                return;
            }

            this.postMovie(movieObj);
            $(titleInp).val('');
            $(descriptionInp).val('');
            $(yearInp).val('');
            $(ratingInp).val('');
            $(genresInp).val('');
            $(starringInp).val('');
            $(imageInp).val('');
        })
    }

    async filterMovies(year) {
        const { searchInp, moveisHolder } = selectors;
        try {
            const movies = await movieService.getMoviesByYear(year);
            $(moveisHolder).find('.movie').detach();

            $(searchInp).val('');
            if (movies.length === 0) {
                notifications.showError(`No movies found in the database for year: ${year}`)
                return;
            }
            this.importMovies(movies);
        } catch (err) {
            console.log(err);
        }
    }

    async postMovie(movieObj) {
        try {
            await movieService.createMovie(movieObj);
            $('#movies').click();
        } catch (err) {
            console.log(err);
        }
    }

    async renderMovies() {
        try {
            const movies = await movieService.getAllMovies();
            this.importMovies(movies);
        } catch (err) {
            console.log(err);
        }
    }

    importMovies(movies) {
        const { moveisHolder } = selectors;

        $.get("../templates/movie-card.html")
            .then((profileHTML) => {

                let templateHTML = '';
                for (const movie of movies) {
                    templateHTML += profileHTML
                        .replace('{{title}}', movie.title)
                        .replace('{{imageUrl}}', movie.imageUrl)
                        .replace('{{description}}', movie.description)
                        .replace('{{genres}}', movie.genres)
                        .replace('{{year}}', movie.year)
                        .replace('{{rating}}', movie.rating)
                        .replace('{{starring}}', movie.starring)
                }
                $(moveisHolder).append(templateHTML);
                this.handleMovieInstanceClick();
            })
    }

    handleMovieInstanceClick() {
        const { movieInstance, curMovieInstance } = selectors;

        $(movieInstance).on('click', (e) => {
            if ($(e.target).parents(movieInstance).hasClass('movie--current')) {
                $(e.target).parents(movieInstance).removeClass('movie--current');
            } else {
                $(curMovieInstance).removeClass('movie--current');
                $(e.target).parents(movieInstance).addClass('movie--current');
            }
        })
    }
}

window.HomePageRouter = HomePageRouter;



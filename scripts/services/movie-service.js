const movieService = (() => {
    function getAllMovies() {
    return backendless.get('data', 'movies', 'backendless')
  }
  
  function createMovie(data) {
    return backendless.post('data', 'movies', 'backendless', data)
  }

  function getMoviesByYear(year) {
    return backendless.get('data', `movies?where=year%20%3D%20'${year}'`, 'backendless')
  }

  function movieInputIsValid(obj) {
    let genresPattern = /^[A-Za-z ]{1,}$/;
    let castPattern = /^[A-Za-z', ]{1,}$/;
    let yearPattern = /^[0-9]{4,4}$/;

    if (obj.title.length < 6) {
      notifications.showError('The title should be at least 6 characters long.');
      return false;
    } else if (!(obj.imageUrl.startsWith('http://') || obj.imageUrl.startsWith('https://'))) {
      notifications.showError('The image should start with "http://" or "https://".');
      return false;
    } else if (obj.description.length < 10) {
      notifications.showError('The description should be at least 10 characters long.');
      return false;
    } else if (!genresPattern.exec(obj.genres)) {
      notifications.showError('The genres must be separated by a single space.');
      return false;
    } else if (!castPattern.exec(obj.starring)) {
      notifications.showError('The cast must be separated by a single come and space.');
      return false;
    } else if (!(yearPattern.exec(obj.year)) || 1800>Number(obj.year) || 2020<Number(obj.year)) {
      notifications.showError('The year should be number between 1800 and 2020.');
      return false;
    } else if (0>Number(obj.rating) || 10<Number(obj.rating)) {
      notifications.showError('The rating should be number between 1 and 10.');
      return false;
    }
    return true;
  }

  return {
    getAllMovies,
    createMovie,
    getMoviesByYear,
    movieInputIsValid
  }
})()
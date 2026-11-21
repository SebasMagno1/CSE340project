
/* ***************************
 * Render Home page
 *************************** */
export function buildHome(req, res) {
    res.render('index', {
        title: 'Home'
    });
}

const SIZE = 4;  //Taille initiale de la Grille

var tab; //Tableau stockant les données du jeu
var finish; //Booléen vérifiant si le jeu est terminé
var score; //Nombre incrémantant le score en cours
var best_score; //Score le plus élevé
var turn; //Nombre comptant le nombre de tours
var save; //Tableau stockant la variable tab pour chaque tour
var undo_redo; //Booléen qui vérifie si on est en mode undo/redo

function initializeArray()
{
    tab = new Array();
    for(var i = 0; i < SIZE; i++)
    {
        tab[i] = new Array();
        for(var j = 0; j < SIZE; j++)
        {
            tab[i][j] = 0;
        }
    }
}

function initialize_best_score()
{
    if (checkCookie('best_score'))
    {
        return getCookie('best_score');
    }
    else
    { 
        return 0;
    }
}

function new_game()
{
    load_game_in_database();
    if (save.length <= 1)
    {
        return true;
    }
    else
    { 
        return false;
    }
}

function new_record()
{
    if (score > best_score)
    {
        return true;
    }
    return false;
}

function save_best_score()
{
    if (new_record())
    {
        setCookie('best_score', score, 365);
    }
}

function load_game()
{
    finish = false;
    undo_redo = false;
    best_score = initialize_best_score();
    var size = save.length-1;
    tab = save[size][0];
    turn = size;
    score = Number(save[size][1]);
    save_game();
}

function reset_game()
{
    delete_database();
    initializeArray();
    finish = false;
    undo_redo = false;
    score = 0;
    best_score = initialize_best_score();
    turn = 0;
    save = Array();
    add_random();
    add_random();
    save_game();
    save_in_database(copy_tab(), turn);
}

function save_game()
{
    save[turn] = Array();
    save[turn][0] = copy_tab();
    save[turn][1] = score;
}

function undo_action()
{
    undo_redo = true;
    turn--;
    tab = save[turn][0];
    score = save[turn][1];
}

function redo_action()
{
    undo_redo = true;
    turn++;
    tab = save[turn][0];
    score = save[turn][1];
}

function empty_for_random()
{
    var empty = Array();
    var count = 0;
    var SIZE = tab.length;
    for(var i = 0; i < SIZE; i++)
    {
        for(var j = 0; j < SIZE; j++)
        {
            if (tab[i][j] == 0)
            {
                empty[count] = Array();
                empty[count]['line'] = i;
                empty[count]['column'] = j;
                count++;
            }
        }
    }
    return empty;
}

function random_location(empty) {
    var SIZE = empty.length;
    var key = Math.floor(Math.random() * SIZE);
    return empty[key];
}

function random_number()
{
    var max = 10;
    var random = Math.floor(Math.random() * max);
    if (random == 0)
    {
        return 4;
    }
    return 2;
}

function add_random() {
    var empty = empty_for_random();
    var random = random_location(empty);
    var number = random_number();
    tab[random['line']][random['column']] = number;
}

function copy_tab() {
    var copy = new Array();
    for(var i = 0; i < SIZE; i++)
    {
        copy[i] = new Array();
        for(var j = 0; j < SIZE; j++)
        {
            copy[i][j] = tab[i][j];
        }
    }
    return copy;
}

function no_change(old_tab)
{
    for(var i = 0; i < SIZE; i++)
    {
        for(var j = 0; j < SIZE; j++)
        {
            if (old_tab[i][j] !== tab[i][j])
            {
                return false;
            }
        }
    }
    return true;
}

function no_merge() {
   for (var i = 0 ; i < SIZE ; i++)
   {
       for (var j = 0 ; j < SIZE ; j++)
       {
            if ((i != 0) && (tab[i][j] == tab[i-1][j]))
            {
                return false;
            }
            if ((i != SIZE-1) && (tab[i][j] == tab[i+1][j]))
            {
                return false;
            }
            if ((j != 0) && (tab[i][j] == tab[i][j-1]))
            {
                return false;
            }
            if ((j != SIZE-1) && (tab[i][j] == tab[i][j+1]))
            {
                return false;
            }
       }
   }
    return true;
}

function full_array()
{
    for(var i = 0; i < SIZE; i++)
    {
        for(var j = 0; j < SIZE; j++)
        {
            if (tab[i][j] == 0)
            {
                return false;
            }
        }
    }
    return true;
}

function has_loose() {
    loose = true;
    loose = full_array();
    if (loose)
    {
        loose = no_merge();
    }
    return loose;
}

function has_win() {
    win = false;
    for(var i = 0; i < SIZE; i++)
    {
        for(var j = 0; j < SIZE; j++)
        {
            if (tab[i][j] == 2048)
            {
                win = true;
            }
        }
    }
    return win;
}

function capture_direction(event)
{   
        if (event.which == 37) {
            return 'left';
        }
        if (event.which == 38) {
            return 'top';
        }
        if (event.which == 39) {
            return 'right';
        }
        if (event.which == 40) {
            return 'bottom';
        }
        return null;
}

function column_value(line, start, offset = 1)
{
    if (offset > 0)
    {
        for (var i = start ; i < SIZE ; i++)
        {
            if (tab[line][i] != 0)
            {
                return i;
            }
        }
    }
    else
    {
        for (var i = start ; i >= 0 ; i--)
        {
            if (tab[line][i] != 0)
            {
                return i;
            }
        }
    }
    return null;
}

function column_empty(line, start, offset = 1)
{
    if (offset > 0)
    {
        for (var i = start ; i < SIZE ; i++)
        {
            if (tab[line][i] == 0)
            {
                return i;
            }
        }
    }
    else
    {
        for (var i = start ; i >= 0 ; i--)
        {
            if (tab[line][i] == 0)
            {
                return i;
            }
        }
    }
    return null;
}

function line_value(column, start, offset = 1)
{
    if (offset > 0)
    {
        for (var i = start ; i < SIZE ; i++)
        {
            if (tab[i][column] != 0)
            {
                return i;
            }
        }
    }
    else
    {
        for (var i = start ; i >= 0 ; i--)
        {
            if (tab[i][column] != 0)
            {
                return i;
            }
        }
    }
    return null;
}

function line_empty(column, start, offset = 1)
{
    if (offset > 0)
    {
        for (var i = start ; i < SIZE ; i++)
        {
            if (tab[i][column] == 0)
            {
                return i;
            }
        }
    }
    else
    {
        for (var i = start ; i >= 0 ; i--)
        {
            if (tab[i][column] == 0)
            {
                return i;
            }
        }
    }
    return null;
}

function play(direction)
{
    if (undo_redo)
    {
        delete_last_action();
        load_game_in_database();
        undo_redo = false;
    }
    if (direction == 'left') {
        move_left();
        merge_left();
    }
    if (direction == 'top') {
        move_top();
        merge_top();
    }
    if (direction == 'right') {
        move_right();
        merge_right();
    }
    if (direction == 'bottom') {
        move_bottom();
        merge_bottom();
    }
    if (!full_array())
    {
        add_random();
    }
    turn++;
    save_game();
    save_in_database(copy_tab(), turn);
}

function move_left()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        var start = 0;
        while (start < SIZE)
        {
            var empty = column_empty(i, start);
            if (empty != null)
            {
                start = empty;
                var value = column_value(i, start);
                if (value != null)
                {
                    var buffer = tab[i][empty];
                    tab[i][empty] = tab[i][value];
                    tab[i][value] = buffer;
                    start++;
                }
                else
                {
                    start = SIZE;
                }
            }
            else
            {
                start = SIZE;
            }
        }
    }
}

function move_right()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        var start = SIZE-1;
        while (start >= 0)
        {
            var empty = column_empty(i, start, -1);
            if (empty != null)
            {
                start = empty;
                var value = column_value(i, start, -1);
                if (value != null)
                {
                    var buffer = tab[i][empty];
                    tab[i][empty] = tab[i][value];
                    tab[i][value] = buffer;
                    start--;
                }
                else
                {
                    start = -1;
                }
            }
            else
            {
                start = -1;
            }
        }
    }
}

function move_top()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        var start = 0;
        while (start < SIZE)
        {
            var empty = line_empty(i, start);
            if (empty != null)
            {
                start = empty;
                var value = line_value(i, start);
                if (value != null)
                {
                    var buffer = tab[empty][i];
                    tab[empty][i] = tab[value][i];
                    tab[value][i] = buffer;
                    start++;
                }
                else
                {
                    start = SIZE;
                }
            }
            else
            {
                start = SIZE;
            }
        }
    }
}

function move_bottom()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        var start = SIZE-1;
        while (start >= 0)
        {
            var empty = line_empty(i, start, -1);
            if (empty != null)
            {
                start = empty;
                var value = line_value(i, start, -1);
                if (value != null)
                {
                    var buffer = tab[empty][i];
                    tab[empty][i] = tab[value][i];
                    tab[value][i] = buffer;
                    start--;
                }
                else
                {
                    start = -1;
                }
            }
            else
            {
                start = -1;
            }
        }
    }
}

function merge_left()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        for (var j = 0 ; j < SIZE-1 ; j++)
        {
            if (tab[i][j] == tab[i][j+1])
            {
                tab[i][j] = 2*tab[i][j];
                score += tab[i][j];
                tab[i][j+1] = 0;
                move_left();
            }
        }
    }
}

function merge_right()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        for (var j = SIZE-1 ; j >= 1 ; j--)
        {
            if (tab[i][j] == tab[i][j-1])
            {
                tab[i][j] = 2*tab[i][j];
                score += tab[i][j];
                tab[i][j-1] = 0;
                move_right();
            }
        }
    }
}

function merge_top()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        for (var j = 0 ; j < SIZE-1 ; j++)
        {
            if (tab[j][i] == tab[j+1][i])
            {
                tab[j][i] = 2*tab[j+1][i];
                score += tab[j][i];
                tab[j+1][i] = 0;
                move_top();
            }
        }
    }
}

function merge_bottom()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        for (var j = SIZE-1 ; j >= 1 ; j--)
        {
            if (tab[j][i] == tab[j-1][i])
            {
                tab[j][i] = 2*tab[j][i];
                score += tab[j][i];
                tab[j-1][i] = 0;
                move_bottom();
            }
        }
    }
}

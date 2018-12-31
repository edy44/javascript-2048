var url;

function save_in_database(save, turn)
{
    url = "php/Save.php";
    $.ajax(url, {
        type: 'POST',
        data: {'turn':turn, 'save':save, 'score':score}
    });
}

function delete_database()
{
    url = "php/Delete.php";
    $.ajax(url, {
        type: 'GET'
    });
}

function delete_last_action()
{
    url = "php/Delete.php";
    $.ajax(url, {
        type: 'POST',
        data: {'turn':turn}
    });
}

function load_game_in_database()
{
    url = "php/Load.php";
    save = Array();
    $.ajax(url, {
        async: false,
        success: function(data) {
            var size = data.length;
            for (var i = 0 ; i < size ; i++)
            {
                save[i] = Array();
                save[i][0] = data[i]['array'];
                save[i][1] = data[i]['score'];
            }
        }
    });
}

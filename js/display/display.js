var colors = Array();
colors[2] = "#0158cb"; //Bleu
colors[4] = "#22abb0"; //Bleu ciel
colors[8] = "#2e5425"; //Vert
colors[16] = "#6edb1d"; //Vert Clair
colors[32] = "#fffe04"; //Jaune; 
colors[64] = "#b5a850"; //Marron clair
colors[128] = "#ffa300"; //Orange
colors[256] = "#db6721"; //orange foncé 
colors[512] = "#e90003"; //Rouge
colors[1024] = "#db21be"; //Violet
colors[2048] = "#000000"; //Noir 

function init_array()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        $("#grid").append('<tr class="line line' + i + '"></tr>');
        for (var j = 0 ; j < SIZE ; j++)
        {
            $(".line"+i).append('<th id="l'+i+'c'+j+'" class="block"></th>');

        }
    }
    var proportion = (100/SIZE)-1;
    $(".line").css("height", proportion+"%");
    $(".block").css("width", proportion+"%");
    $(".block").css("font-size", 4.2-(SIZE/3)+"em");
}

function init_interface()
{
    $("#interface").append('<div id="score"></div>');
    $("#interface").append('<button id="new_game">New</button>');
    $("#interface").append('<button id="undo_action">Undo</button>');
    $("#interface").append('<button id="redo_action">Redo</button>');
    $("#interface #score").append('<div class="score">Score</div><div class="score">Record</div>');
    $("#interface #score").append('<div id="current_score" class="score"></div>');
    $("#interface #score").append('<div id="best_score" class="score"></div>');
}

function init_html()
{
    $("body").append('<div id="interface"></div>');
    $("body").append('<div id="game"></div>');
    $("body").append('<h1>2048 - The Game</h1>');
    $("#game").append('<table id="grid"></table>');
    init_array();
    init_interface();
}

function init_game()
{
    if (new_game())
    {
        reset_game();
    }
    else
    {
        load_game();
    }
    actualize_html();
}

function actualize_array()
{
    for (var i = 0 ; i < SIZE ; i++)
    {
        for (var j = 0 ; j < SIZE ; j++)
        {
            if (tab[i][j] != 0)
            {
                $("#game .line #l"+i+"c"+j).text(tab[i][j]);
                $("#game .line #l"+i+"c"+j).css("color", colors[tab[i][j]]);
            }
            else
            {
                $("#game .line #l"+i+"c"+j).text("");
            }
        }
    }
}

function actualize_interface()
{
    $("#interface #score #current_score").text(score);
    $("#interface #score #best_score").text(best_score);
}

function actualize_html()
{
    actualize_array();
    actualize_interface();
}

function end_game(message, new_game = false)
{
    if(!new_game)
    {
        save_best_score();
    }
    if (confirm(message))
    {
        reset_game();
        actualize_html();
    }
}

function event_play()
{
    $(document).on('keydown', function(e){
        var direction = capture_direction(e);
        if ((direction != null) && (!finish))
        {
            play(direction);
            actualize_html();
            if (has_loose())
            {
                finish = true;
                if (new_record())
                {
                    end_game("A new best score... but not 2 048 points yet ! Not too bad... Another Try ?");
                }
                else
                {
                    end_game("You are a LOOSER ! Another Try ?");
                }
            }
            if (has_win())
            {
                finish = true;
                if (new_record())
                {
                    end_game("Whoo, it'a a PERFECT win ! 2 048 points with a new record !!! Congratulations !!! Another Try ?");
                }
                else
                {
                    end_game("Whoo, it'a a win ! Not your best score, but you have finish with 2 048 points, nice ! Another Try ?");
                }
            }
        }
    });
}

function event_undo()
{
    $("#interface #undo_action").on('click', function(){
        if (turn != 0)
        {
            undo_action();
            actualize_html();
        }
        else
        {
            alert("This is already your first turn !");
        }
    });
}

function event_redo()
{
    $("#interface #redo_action").on('click', function(){
        if (turn < save.length-1)
        {
            redo_action();
            actualize_html();
        }
        else
        {
            alert("This is already your last turn !");
        }
    });
}

function event_new()
{
    $("#interface #new_game").on('click', function(){
        end_game("Are you sure to start a new Game ?", true);
    });
}

$(document).ready(function() {
    init_html();
    init_game();
    event_play();
    event_undo();
    event_redo();
    event_new();
});

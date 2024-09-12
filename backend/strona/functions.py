import math


def update_win_rates(game_id, database_ref):
    game_data = database_ref.child("games").child(game_id).get().val()
 
    if not game_data:
        print(f"No game data found for game_id: {game_id}")
        return
 
    choice_data = game_data.get('choice_data', [])
    play_count = game_data.get('play_count', 0)
 
    for choice in choice_data:
        win_count = choice.get('win_count', 0)
        pick_count = choice.get('pick_count', 0)
        shown_in_pair = choice.get('shown_in_pair', 0)
       
        if pick_count > 0:
            championship_rate = math.ceil((win_count * 100) / play_count)
            win_rate = math.ceil((pick_count * 100) / shown_in_pair)
        else:
            championship_rate = 0  
            win_rate = 0  
 
        choice['championship_rate'] = championship_rate
        choice['win_rate'] = win_rate
 
    database_ref.child("games").child(game_id).update({"choice_data": choice_data})
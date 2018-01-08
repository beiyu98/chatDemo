$(function(){
    let content = $('#content');
    let status = $('#status');
    let input = $('#input');
    let myName = false;

    socket = io.connect('http://120.24.253.225/chat/');
    socket.on('open',function(){
        status.text('choose a name');
    });

    socket.on('system',function(json){
        let p = '';
        if(json.type === 'welcome'){
            if(myName==json.text){
                status.text(myName +': ').css('color',json.color);
                p = '<p style="background:' +json.color+'">system@ '+json.time+' :welcome '+json.text+'</p>';
            }else if(json.type=='disconnect'){
                p = '<p style="background:'+json.color +'">system@ '+json.time+' :Bye'+json.text+'</p>';
            }
            content.prepend(p);
        }
    })

    socket.on('message',function(json){
        let p = '<p><span style="color:'+json.color+';">'+json.author+'</span> @' +json.time +' :' +json.text+'</p>';
        content.prepend(p);
    });

    input.keydown(function(e){
        if(e.keyCode === 13){
            let msg = $(this).val();
            if(!msg) return;

            socket.send(msg);

            $(this).val('');
            if(myName ===false){
                myName = msg;
            }
        }
    })
});
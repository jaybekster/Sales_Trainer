/*(function(){var script=document.createElement('script');script.setAttribute('src','http://cssrefresh.frebsite.nl/js/cssrefresh.js');var head=document.getElementsByTagName('head');head[0].appendChild(script);})();*/
/* PubSub*/
     var o = $( {} );
    $.each({
        on: 'subscribe',
        trigger: 'publish',
        off: 'unsubscribe' 
    }, function( key, api ) {
        $[api] = function() {
            o[key].apply( o, arguments );
        }
    });

    if(!Array.indexOf){
      Array.prototype.indexOf = function(obj){
          for(var i=0; i<this.length; i++){
              if(this[i]==obj){
                  return i;
              }
          }
          return -1;
      }
  }

/*! Backstretch - v2.0.1 - 2012-10-01
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT */

function isEven(value) {
    if (value%2 == 0)
        return true;
    else
        return false;
};

var clientsDB = TAFFY(data.clients), //все клиенты
  questionsDB = TAFFY(data.questions), //все вопросы
  productsDB = TAFFY(data.products), //все продукты
  settingsDB = data.settings, //настройки тренажёра
  queue = settingsDB.queue, //массив очереди клиентов
  temp = null; // глобальная перемення для всяких операций

settingsDB.old_score = 0;
settingsDB.current_score = 0;

if (settingsDB.random_queue) { //если рандом очереди включён, то пересобираем массив очереди
  queue = generateArrayRandomNumber1(0, queue.length).map(function(obj) {
    return ("Client_"+obj);
  })
}

//начало инициализации SCORM
pipwerks.SCORM.version = "1.2";
var success = pipwerks.SCORM.init();
if (success) {
  scorm  = pipwerks.SCORM;
  settingsDB.old_score = (function() {
    if ( Boolean( parseInt(scorm.get("cmi.core.score.raw")) )!=true ) {
      scorm.set("cmi.core.score.raw", 0);
      scorm.save();
      return 0;
    } else {
      var percent = parseInt(scorm.get("cmi.core.score.raw"));
      return parseInt(settingsDB.queue.length*percent/100);
    }
  })();
} else {
  scorm = null;
}
//окончание инициализации SCORM

currentClinet = -1;
$(function(){
  $("body").removeClass("js");
$(".jqmWindow").hide().jqm({
 
  });
$("#first_page").jqmShow();

var jqmoverlay = setInterval(function() {
  if ( $(".jqmOverlay").length == 1 ) {
    var overlay = $(".jqmOverlay").clone(false).attr("id", "first_page_overlay");
    $(".jqmOverlay").replaceWith(overlay);
    clearInterval(jqmoverlay)
    jqmoverlay = overlay;
    return;
  }
}, 200)


$("#first_page").on("click", "#begin", function() {
  $("#first_page").jqmHide();
  $("#instruction_popup").jqmShow();
  $("#instruction_popup").find("#continue_course").one("click", function() {
    $("#instruction_popup").jqmHide();
    $("#first_page").hide().siblings(".container").show();
    jqmoverlay.remove();
    initC(queue[++currentClinet]);
  })
})
$("#finish_queue").on("click", "a", function() {
  switch ($(this).attr("id")) {
    case ("close_course"):
      window.close();
      break;
    case ("restart_course"):
      settingsDB.current_score = 0;
      clientsDB = TAFFY(data.clients);
      initC(queue[currentClinet=0]);
      $("#qpersons").children().removeClass("positive negative")
      $.prototype.jqmHide.apply( $(this).closest(".jqmWindow") );
      break;
    default:
      break;
  }
})

  var str = "";
  for (var i=0, length=queue.length; i<length; i+=1) {
    str+="<span class=\"qperson\"></span>";
  }
  if (str.length) {
    $(".col_2.header>.rectangle-2>div").append(str);
  } 

$("#queue").next().html( queue.length );



(function() {
  var i=1;
  $prod = $(".products>.closeP.icon");
  /*products().each(function(f) {
    var str = "";
    if (i%2==1) {
      str = "<li><ul class=\"subclass\">";
      str+="<li data-pr_name='"+f.id+"''>"+f.name+"<span class=\"icon info\">\"</span></li>";
      str+="</ul><li>";
      $prod.before(str)
    } else {
      str = "<li data-pr_name='"+f.id+"''>"+f.name+"<span class=\"icon info\">\"</span></li>";
      $(".products .subclass:last").append(str);
    }
    i+=1;
  })*/
})()


$('.face, .responce, .name, .thoughts,.giveprod').fadeOut(0);
var globalClient = '';
var TIME = $("#clock").next().html();
var timer;
function initClient(id) {
  var arrProducts = [],
    arrRandom = null,
    length = null;
clearInterval(timer);
$("#clock").next().html( TIME );
globalClient = id;
$("#qpersons>span").eq(currentClinet).addClass("active").siblings(".active").removeClass("active");
  arrProducts = clientsDB({'id':id}).first().wrong_products;
  arrProducts = arrProducts.concat(clientsDB({'id':id}).first().right_products);
  length = arrProducts.length;
  arrRandom = generateArrayRandomNumber1(0, length);
  $("ul.subclass", ".products").each(function() {
    var $this = $(this);
    $this.parent().next().remove().end().remove();
  })
  $prod = $(".products>.closeP.icon");
  for (var i=0; i<length; i+=1) {
    var str = "";
    if (i%2==0) {
      str = "<li><ul class=\"subclass\">";
      str+="<li data-pr_name='"+arrProducts[arrRandom[i]]+"''>"+productsDB({'id':arrProducts[arrRandom[i]]}).first().name+"<span class=\"icon info\">\"</span></li>";
      str+="</ul><li>";
      $prod.before(str)
    } else {
      str = "<li data-pr_name='"+arrProducts[arrRandom[i]]+"''>"+productsDB({'id':arrProducts[arrRandom[i]]}).first().name+"<span class=\"icon info\">\"</span></li>";
      $(".products .subclass:last").append(str);
    }
  }
  
cl = clientsDB({'id':globalClient}).first()
howDoYouFeel(globalClient);
updateGrade("patience", cl.patience); updateGrade("loyalty", cl.loyalty); updateGrade("competence", cl.competence);
$('.face').attr('src', cl.photo?cl.photo:"").data('face','img/'+cl.id)
$('.name').empty().append(cl.name);
 $('.questions,.responce>span,.thoughts').empty();
 $('.responce,.thoughts').fadeOut();
var q = new Array(), result = quez = null; 
for (var i=0; i<clientsDB({'id':globalClient}).first().right_products.length; i+=1) {
  result = questionsDB({"product": clientsDB({'id':globalClient}).first().right_products[i]}).get();
  if (result.length) $.each(result, function(ind, val) {
    q.push( val )
  })
}

var client_Questions = clientsDB({"id":queue[currentClinet]}).first().questions;
var temp = generateArrayRandomNumber1(0, client_Questions.length);

for (var i=0; i<client_Questions.length; i+=1) {
  var question =  client_Questions[temp[i]];
  if (question && (question = questionsDB({id:question}).first()) ) {
    updatequestionsDB(question.text, question.id);
  }
}

$('.face, .name').fadeIn();
var $clock = $("#clock").next(),
  clock = $clock.text();
timer = setInterval(function() {
  var minutes = clock.substr(1,1);
  var seconds = clock.substr(3,4);
  if (seconds==0 && minutes!=0) {
    minutes-=1;
    seconds = 59;
  } else {
    seconds-=1;
  }
  if (minutes<10) minutes = "0"+String(minutes);
  if (seconds<10) seconds = "0"+String(seconds);
  clock = minutes + ":" + seconds;
  $clock.html(clock);
  if (minutes==0 && seconds==0) {
      clearInterval(timer);
    $(".questions p").addClass('disabled')
    $('.giveprod').fadeOut(300,function(){
      $('.nextClient').fadeIn()  
    });
    developResponce({'thoughts':'','responce':clientsDB({'id':globalClient}).first().timesout});
    $("#qpersons>.qperson.active").addClass("negative");
  }
}, 1000)

}
window.initC = initClient;



function returnAnsById(cid,qid){
ans = clientsDB({'id':cid}).first().answers;

for(e in ans) {
    if(ans[e].id===qid) return ans[e];
}
return false;
};

function changeFace(emo) {
$('.face').attr('src',$('.face').data('face')+emo+'.jpg')
}

function developAnswers(cid,qid) {
  var clnt = clientsDB({'id':cid}).first(),
      answer = null;
  switch(clnt.loyalty) {
    case (1):
    case (2):
      answer = 0;
      break;
    case (3): 
      answer = getRandomInt(0,1);
      break;
    case (4):
    case (5):
      answer = 1;
      break;
  }
$('[data-questid='+qid+']').next('ul').append('<li>'+questionsDB({'id':qid}).first().answers[answer]+'</li>');
developResponce({'responce':questionsDB({'id':qid}).first().answers[answer]});
  return ( questionsDB({'id':qid}).first().answers[answer] );
//answer = returnAnsById(cid,qid);
//changeFace(answer.face);

//developResponce({'thoughts':answer.thought,'responce':answer.answer});
}

function developResponce(obj){
for(el in obj){
$('.'+el).hide(0,function(){$(this).children("span").empty().append(obj[el]).end().show()})
$(".thoughts").hide();
}}

function howDoYouFeel(id){
ob = {}
cl =  clientsDB({'id':id}).first();
ob.mood = cl.mood;
updatePr('mood',cl.mood)

  //  $('.xp').data('value',cl.xp).next('span').empty().append(cl.xp)
   // $('.anger').data('value',cl.anger).next('span').empty().append(cl.anger)
   // $('.stamina').data('value',cl.stamina).next('span').empty().append(cl.stamina)



return ob;
}
hdyf = howDoYouFeel;

clientsDB.settings({onUpdate:function () {
howDoYouFeel(this.id)

}});

function updatePr(w,n){
 // $('.progress > span').width((n>=100?100:n<=0?0:n)+"%")
  pers = n>=100?100:n<=0?0:n;
  color = (pers>=80)?'#14691F':((pers<=79)&&(pers>=30))?'#cb695c':'#913013';
  $('.'+w+' span').animate({
    'width':  pers+"%"
  },100).css('background-color',color).parent().next('span').empty().append(pers)
}

function updateGrade(w, n) {
  pers = n>=5?5:n<=0?0:n;
  color = (pers>=4)?'#14691F':((pers<=3)&&(pers>=2))?'#cb695c':'#913013';
  $('.'+w+' span').animate({
    'width':  (100/5*pers)+"%"
  },100).css('background-color',color).parent().next('span').empty().append(pers)
}


function updatequestionsDB(q,i) {
    $('.questions').append('<p data-questid=\''+i+'\'>'+q+'</p><ul class=\'resp\'></ul>');
}

$(".close>span").on("click", function() {
  $.prototype.jqmHide.apply( $(this).closest(".jqmWindow") );
  return;
})

$('.questions').on('click','p',function(){
  var mood = difficult = null;
    if(!$(this).hasClass('disabled')){
tqI = $(this).data('questid');
    developAnswers(globalClient, tqI);
    difficult = questionsDB({'id':tqI}).first().difficult;
    mood=clientsDB({'id':globalClient}).first().mood;
    switch(clientsDB({'id':globalClient}).first().competence) {
      case (1):
      case (2):
        mood = mood + parseInt( (difficult) ? "+10" : "-10", 10);
        clientsDB({'id':globalClient}).update("mood", mood);
      case (3):
        break;
      case (4):
      case (5):
        mood = mood + parseInt( (difficult) ? "-10" : "+10", 10);
        clientsDB({'id':globalClient}).update("mood", mood);
        break;
    }
    ob = howDoYouFeel(globalClient);
    t = '<li>';
    $.each(ob,function(v,i){
      t+=this
    })
    $(this).addClass('disabled')//.next('ul').append(t+'</li>')


} else {

    //$(this).next('ul').toggle();
}})

$('.status, .closeS').on('click',function(){
           $( ".stats" ).toggleClass( "openedS", 300, function() {
             $("#status>div")[  $(".stats").hasClass("openedS")?"addClass":"removeClass" ]("active");
           });
})

$('.giveprod, .closeP').on('click',function(){
       $('.products').toggleClass('openedProd',300, function() {
          $(".giveprod")[  $(".products").hasClass("openedProd")?"addClass":"removeClass" ]("active");
       });
})

$(".products").on("click", ".subclass>li", function() {
  clearInterval(timer);
    $('.products').toggleClass('openedProd')
    $(".questions p").addClass('disabled')
    if( (clientsDB({'id':globalClient}).first().right_products.indexOf( $(this).data('pr_name') )!=-1) && (clientsDB({'id':globalClient}).first().mood>=50)  ) {
      $('.giveprod').fadeOut(300,function(){
        settingsDB.current_score+=1;
        if (settingsDB.current_score>settingsDB.old_score && scorm) {
          scorm.set("cmi.core.score.raw", parseInt(settingsDB.current_score/settingsDB.queue.length*100));
          scorm.save();
        }
        $('.nextClient').fadeIn()  
      });
$("#qpersons>.qperson.active").addClass("positive");
developResponce({'thoughts':'Чудесный работник Банка, обязательно к нему вернусь еще! И пришлю друзей','responce': clientsDB({'id':globalClient}).first().right_choice });
    } else {
developResponce({'thoughts':'Ерунда какая, никогда сюда больше не вернусь!','responce': clientsDB({'id':globalClient}).first().wrong_choice });
$("#qpersons>.qperson.active").addClass("negative");
                $('.giveprod').fadeOut(300,function(){
                  $('.nextClient').fadeIn()  
                });
    }
    
}).on("click", 'span.info', function(e) {
    var pr_name = $(this).parent().data("pr_name");
    $("#jqmWindow").children(".text").html( productsDB({"id": pr_name}).first().desc )
    $("#jqmWindow").children(".title").html( productsDB({"id": pr_name}).first().name )
    $("#jqmWindow").jqmShow();
    e.stopPropagation();
})

$('.nextClient').on('click',function(){
    $(this).fadeOut(300,function(){
        $('.giveprod').removeClass("active").fadeIn();
        if((currentClinet+1)===queue.length) {
        //alert('очередь закончилась')
        $("#finish_queue").find("#vam_udalos_ubedit").html(
          "Вам удалось убедить <b>" + settingsDB.current_score + "</b> из " + settingsDB.queue.length + " клиентов"
          )
          .end().find("#percent_result").html(
            "Результат <b>" + parseInt(settingsDB.current_score/settingsDB.queue.length*100) + "%</b>"
            );
        $("#finish_queue").jqmShow();
    }else {
        initC(queue[++currentClinet])
        $("#queue").next().html( queue.length-currentClinet );
    }
    })
})

$("#help, #about").on("click", function() {
  $("#"+$(this).attr("id")+"_popup").jqmShow();
})

$('.giveprod').fadeIn();

})

function generateArrayRandomNumber (min, len) {
  var totalNumbers    = questionsDB({}).count()-1 - min + 1,
    arrayTotalNumbers   = [],
    arrayRandomNumbers  = [],
    tempRandomNumber;
  while (totalNumbers--) {
    arrayTotalNumbers.push(totalNumbers + min);
  }

  while (len--) {
    tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
    arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
    arrayTotalNumbers.splice(tempRandomNumber, 1);
  }

  return arrayRandomNumbers;
}
function generateArrayRandomNumber1 (min, len) {
  var totalNumbers    = len-1 - min + 1,
    arrayTotalNumbers   = [],
    arrayRandomNumbers  = [],
    tempRandomNumber;
  while (totalNumbers--) {
    arrayTotalNumbers.push(totalNumbers + min);
  }

  while (len--) {
    tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
    arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
    arrayTotalNumbers.splice(tempRandomNumber, 1);
  }

  return arrayRandomNumbers;
}
//  Нужно учесть что в диапазоне участвуют и минимальное и максимальное число
//  тоесть если задать (0, 100) то на выходе получим массив из 101-го числа
//  от 1 до 100 и плюс число 0
//alert(generateArrayRandomNumber(45, 67));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
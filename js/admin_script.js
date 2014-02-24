var products = data.products;
var productsDB = TAFFY(data.products);
var questionsDB = TAFFY(data.questions);
var clientsDB = TAFFY(data.clients);
var settingsDB = data.settings;

(function(window) {
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun /*, thisp*/) {
			var len = this.length;
			if (typeof fun != "function") throw new TypeError();
			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in this) fun.call(thisp, this[i], i, this);
			}
		}
	}
})(this)



function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
};

function sendAJAX() {
	send_data = JSON.parse(JSON.stringify(data)); //копирование массива data для изменения и сохранения его, а оригинальный оставляем
	//начало удаления разных служебных парметров от использования taffyDB
	for (i in send_data) {
		if (send_data.hasOwnProperty(i) && send_data[i] instanceof Array) {
			for (var y=0, length=send_data[i].length; y<length; y+=1) {
				var obj = send_data[i][y];
				for (z in obj) {
					if (z==="___id" || z==="___s") delete obj[z];
				}
			}
		}
	}
	//конец удаления разных служебных парметров от использования taffyDB
	$.ajax({
		type: "POST",
		url: "server_functions.html",
		data: "op_type=00&data="+unescape(JSON.stringify(send_data).replace(/\\u/g, '%u'))
	}).done(function(msg) {
		curClient.writeIn();
		$("#save_true").slideDown(700).delay(1000).slideUp(700);
	}).fail(function(msg) {
		$("#save_false").slideDown(700).delay(1000).slideUp(700);
		console.log("Error: " + msg);
	})
}

function reReadProducts() {
	$(".left_column>ul", "#p3").empty();
	productsDB().each(function(rec) {
	var str = "<li class='normal' data-id=" + rec.id + ">";
	str+=rec.name;
	str+="</li>";
	$(".left_column>ul", "#p3").append(str);
	})
	$("ul>li", "#p3 .left_column").qtip({
		content: function() {
			var id = $(this).data("id");
			var changeButton = "<span class='change' style='display:block;'></span>";
			var removeButton = "<span class='remove' style='display:block;'></span>";
			var text = "<div>"+productsDB({"id": id}).first().desc+"</div>" + changeButton + removeButton;
			return text;
		},
		position: {
			my: 'left top',
			at: 'top right'
		},
		events: {
			show: function(event, api) {
				$(api.elements.target).toggleClass("normal selected");
				return;
			},
			hide: function(event, api) {
				$(api.elements.target).toggleClass("normal selected");
				return;
			},
			render: function(event, api) {
				$(api.elements.content).on("click", ".change", function() {
					var product_id = $(api.elements.target).data("id"),
						product = productsDB({"id":product_id}).first();
					if (!product_id || !product ) return false;
				$(".jqmWindow#product_edit>.product").data("id", product.id).find(".name").val(product.name)
					.end().find(".desc").val(product.desc).html(product.desc)
					$(".jqmWindow#product_edit").jqmShow();
				}).on("click", ".remove", function() {
					var product_id = $(api.elements.target).data("id");
					if (!product_id) return false;
					var product = productsDB({"id":product_id}).first();
					if ( window.confirm("Вы уверены, что хотите удалить продукт \"" + product.name + "\"?") ) {
$.each( clientsDB().select("right_products", "wrong_products"), function(st, obj) {
	var len = obj.length;
	while(len--) {
		if (!obj[len]) continue;
		var products = obj[len];
		if ( products.indexOf(product_id)!==-1 ) {
			products.splice( products.indexOf(product_id), 1 )
		}
	}
} )
productsDB({id: product_id}).remove();
data.products = productsDB().get();
sendAJAX();
reReadProducts();
					} else {
return false;
					}
				})
			}
		},
		show: {
			event: 'click'
		},
		hide: {
			event: 'unfocus'
		}
	})
}

function reReadQuestions() {
	$(".left_column>ul", "#p4").empty();
	questionsDB().each(function(rec, n) {
		var str = "<li class='normal' data-id=" + rec.id + ">";
		str+="Вопрос №"+(++n);
		str+="</li>";
		$(".left_column>ul", "#p4").append(str);
	})
	$("ul>li", "#p4 .left_column").qtip({
		content: function() {
			var id = $(this).data("id");
			var question = questionsDB({"id": id}).first();
			var changeButton = "<span class='change' style='display:block;'></span>";
			var removeButton = "<span class='remove' style='display:block;'></span>";
			var text = "<div>"+
				"<div class='ask_number'>"+this.html()+"</div>"+
				"<div class='ask'>"+question.text+"</div>"+
				"<div class='answer0'>"+question.answers[0]+"</div>"+
				"<div class='answer1'>"+question.answers[1]+"</div>"+
				"</div>"+
				changeButton + removeButton;
			return text;
		},
		position: {
			my: 'left top',
			at: 'top right',
			target: $("#p4 .left_column ul>li:first-child")
		},
		events: {
			show: function(event, api) {
				api.elements.tooltip.addClass("p4")
				api.elements.tip.remove();
				api.elements.target.toggleClass("normal selected");
				return;
			},
			hide: function(event, api) {
				$(api.elements.target).toggleClass("normal selected");
				return;
			},
			render: function(event, api) {
				$(api.elements.content).on("click", ".change", function() {
					var question_id = $(api.elements.target).data("id"),
						question = questionsDB({"id":question_id}).first();
					if (!question_id || !question ) return false;
				$(".jqmWindow#question_edit>.question").data("id", question.id).find(".text").val(question.text).html(question.text)
					.end().find(".answer_0").val(question.answers[0])
					.end().find(".answer_1").val(question.answers[1])
					.end().find(".difficult>option[value="+question.difficult+
						"]").attr("selected", "selected");
					$(".jqmWindow#question_edit").jqmShow();
				}).on("click", ".remove", function() {
					var question_id = $(api.elements.target).data("id");
					var text = $(api.elements.target).text();
					if (!question_id) return false;
					var question = productsDB({"id":question_id}).first();
					if ( window.confirm("Вы уверены, что хотите удалить вопрос \""+text+"\"?") ) {
$.each( clientsDB().select("questions"), function(st, obj) {
	var len = obj.length;
	while(len--) {
		if (!obj[len]) continue;
		var questions = obj;
		if ( questions.indexOf(product_id)!==-1 ) {
			questions.splice( questions.indexOf(product_id), 1 )
		}
	}
} )
questionsDB({id: product_id}).remove();
data.questions = questionsDB().get();
sendAJAX();
reReadQuestions();

					} else {
return false;
					}
				})
			}
		},
		show: {
			event: 'click'
		},
		hide: {
			event: 'unfocus'
		}
	})
}

function in_array(value, array) 
{
	for(var i = 0; i < array.length; i++) 
	{
		if(array[i] == value) return true;
	}
	return false;
}

function Client(id) {
	var client = clientsDB({"id":id}).first();
	if (!client) {
		this.id = id;
		this.right_products = [];
		this.wrong_products = [];
		this.name = null;
		this.questions = [];
		return;
	}
	for (i in client) {
		this[i] = client[i];
	}
}

//Очистка данных о клиенте
Client.prototype.clearIn = function() {
	$("#products>li:last-child").prevAll().remove();
	$(".products", "#p1>.right_column").empty();
	$(".questions>li:last-child", "#p1>.right_column").prevAll().remove();
	$(".feedback>li:first-child", "#p1>.left_column").nextAll().remove();
	//$(".timesout>li:first-child", "#p1>.left_column").nextAll().remove();
	$(".timesout>li:first-child", "#p1>.left_column").nextAll().html("...");
	$(".photo>img", "#p1").replaceWith("<img src='' \	>")
	$("#client_id", "#p1>.left_column").html(self.id);
	$("input#mood").val(0);
	$("#p1 .left_column>ul").first().find(".block_container").each(function() {
		$(this).find(".active").removeClass("active");
	});
	return this;
}

//Чтение данных о клиенте и показ их
Client.prototype.writeIn = function() {
	var self = this,
		i = null, temp = null, length = null,
		$edits_array = $.makeArray();
	self.clearIn();
	$(".name", "#p1>.right_column").html(self.name);
	$(".photo>img", "#p1").attr("src", self.photo);
	$("#"+self.id+">img", "#p1 .clients").attr("src", self.photo);
	$("#client_id", "#p1>.left_column").html(self.id);
	for (i in self) {
		var $this = $("."+i, "#p1>.left_column");
		if ($this.length!=1) continue;
		if ($this.find("input").length) {
			$this.find("input").val( this[i] )
		} else if ( $this.find(".block_container").length ) {
			$this.find(".block_container").children("div.active").removeClass("active");
			for (var y=0; y<this[i]; y+=1) {
				$this.find(".block_container").children().eq(y).addClass("active");
			}
		} else if ($this.children().length===0){
			$this.val( this[i] );
		}
	};

	var prod = null;

	//наполнение продуктами верными
	for (i=0; i<self.right_products.length; i++) {
		prod = productsDB({"id":self.right_products[i]}).first();
		if (!prod || !prod.name) return false;
		$("#products").prepend("<li data-id='"+self.right_products[i]+"' class='green'>"+prod.name+"</li>");
		$(".products", "#p1>.right_column").append("<li data-id='"+self.right_products[i]+"' class='green'>"+prod.name+"</li>");
	}

	//наполнение продуктами неверными
	for (i=0; i<self.wrong_products.length; i++) {
		prod = productsDB({"id":self.wrong_products[i]}).first();
		if (!prod || !prod.name) return false;
		$("#products").prepend("<li data-id='"+self.wrong_products[i]+"' class='red'>"+prod.name+"</li>");
		$(".products", "#p1>.right_column").append("<li data-id='"+self.wrong_products[i]+"' class='red'>"+prod.name+"</li>");
	}

	//наполнение вопросами
	var question = null;
	for (i=0; i<self.questions.length; i++) {
		question = questionsDB({"id":self.questions[i]}).first();
		if (!question) continue;
		$(".questions>li:last-child", "#p1>.right_column").before("<li data-id=\"" + question.id + "\"><div><span class='first'>№"+(i+1)+"</span><span class='second'>"+question.text+"</span></div></li>");
	}

	//наполнение обратной связи
	temp = ["right_choice", "wrong_choice", "explanation"];
	i = "";
	temp.forEach(function(el, st) {
		i += "<li class='"+el+"'>"+self[temp[st]]+"</li>";
	})
	$(".feedback", "#p1>.left_column").append(i);
	if (self.timesout) $(".timesout", "#p1>.left_column").children().eq(1).html(self.timesout);

	//сделать некоторые поля редактируемыми
	$edits_array.push(
		$(".feedback>li:first-child").nextAll("li"),
		$(".timesout>li:nth-child(2)")
	);

	$.each($edits_array, function(i, obj) {
		obj.editable(
			function(value, settings) {
				return value;
		  	}, {
			data: function(value, settings) {
				return value;
			},
			callback: function(value, settings) {
				return value;
			}
		});
	})

	updatePr( $(".indicators>li.mood", "#p1>.right_column"), self.mood, 100);
	updatePr( $(".indicators>li.patience", "#p1>.right_column"), self.patience, 5);
	updatePr( $(".indicators>li.loyalty", "#p1>.right_column"), self.loyalty, 5);
	updatePr( $(".indicators>li.competence", "#p1>.right_column"), self.competence, 5);


	function updatePr($dom, howmuch, perc) {
		$dom.find("span").css({
			"background-color": (howmuch>(perc/2)-1)?"green":"red",
			"width": $dom.width()/perc*howmuch
		})
	}
}

//Чтение данных о клиенте из формы и обновление информации в объекте (переменной)
Client.prototype.readIn = function() {
	var self = this;

	client_data_new = new Client();

	client_data_new.id = curClient.id;

	client_data_new.name = $("#p1 .name").val();

	client_data_new.photo = $(".photo>img", "#p1 .left_column").attr("src");

	// заполнение продуктами
	$("#products", "#p1").children("li[data-id]").each(function(st, obj) {
		if ( !$(obj).data("id") ) return;
		if ( $(obj).hasClass("green") ) {
			client_data_new.right_products.push($(obj).data("id"));
		} else if ( $(obj).hasClass("red") ) {
			client_data_new.wrong_products.push($(obj).data("id"));
		};
	});


	//заполнение вопросами
	$(".questions", "#p1>.right_column").children("li[data-id]").each(function(st, obj) {
		if ( !$(obj).data("id") ) return;
		client_data_new.questions.push( $(obj).data("id") )
	})

	//заполнение обратной связи
	$(".feedback", "#p1").children("li[class]").each(function(st, obj) {
		client_data_new[ $(obj).attr("class") ] = $(obj).html();
	})

	client_data_new.timesout = function() {
		if ( $(".timesout", "#p1>.left_column").children("li").length>1 ) {
			return $(".timesout", "#p1>.left_column").children("li").eq(1).html();
		}
	}();

	if ( $("#mood", "#p1").val() ) client_data_new.mood = parseInt($("#mood", "#p1").val(), 10);

	var temp = ["patience", "loyalty", "competence"];
	temp.forEach(function(el, st) {
		client_data_new[el] = $("."+el, "#p1").children(".block_container").find(".active").length
	})

	for (var i in self) {
		if (typeof self[i]=="function") {
			continue;
		}
		if ( $("input#"+i, "#left_column").length ) {
			self[i] = $("input#"+i, "#left_column").val()
		}
	};
	$.extend(curClient, client_data_new);
	var client_DB = clientsDB({id:self.id}).first();
	if (!client_DB) {
		clientsDB.insert(client_data_new);
		$(".top_column .clients>ul", "#p1").append("<li id=\""+client_data_new.id+"\" class=\"client\"><img src=\""+client_data_new.photo+"\"></li>")
	}
	clientsDB({id:self.id}).update(client_data_new);
}

$.each(data.clients, function(i, obj) {
	//$(".top_column li").first().after("<li id='"+obj.id+"' class=\"client\"></li>")
	$(".top_column li.clients>ul").append("<li id='"+obj.id+"' class=\"client\">"+
		"<img src='"+obj.photo+"' />"+
		"</li>");
	if ( settingsDB.queue.indexOf(obj.id)<0 ) $("#drag", "#p2").append("<li class='client' data-id='"+obj.id+"'>"+obj.name+" ("+obj.id+")</li>")
})

settingsDB.queue.forEach(function(obj, st) {
	var client = clientsDB({id: obj}).first();

	if (!client) return false;
	$("#drop", "#p2").append("<li class='client' data-id='"+client.id+"'>"+client.name+" ("+client.id+")</li>")
})

$(".top_column .client").on("click", function() {
	$(this).addClass("current").siblings(".current").removeClass("current");
	curClient = new Client( $(this).attr("id") );
	curClient.writeIn();
})

$("header").on("click", "nav>a", function() {
	var $this = $(this),
		ind = ($this.index())+1;
	$("body>#p"+ind).show().siblings("div").hide();
	$this.addClass("active").siblings(".active").removeClass("active");
})
$("#is_random_queue").on("click", function() {
	$(this).toggleClass("active");
})
$(".block_container").on("click", "div", function() {
	var $this = $(this);
	$this[ ($this.hasClass("active")) ? "nextAll" : "prevAll" ]().add($this)[ ($this.hasClass("active")) ? "removeClass" : "addClass" ]("active");
})

$("#p1 .save").click(function() {
	var length = data.clients.length;
	curClient.readIn();
	while (length--) {
		if (data.clients[length].id==curClient.id) {
			$.extend(data.clients[length], curClient);
			curClient.writeIn();
			sendAJAX();
			return;
		}
	}
	data.clients.push(curClient);
	console.log(curClient)
	console.log(data)
	curClient.writeIn();
	sendAJAX();
})

productsDB().each(function(rec) {
	var str = "<li class='normal' data-id=" + rec.id + ">";
	str+=rec.name;
	str+="</li>";
	$(".left_column>ul", "#p3").append(str);
})

$("#products","#p1").on("click", "li", function(){
	var $this = $(this);
	if ( $this.is(":last-child") ) { // если кнопка Изменить, она последняя в списке продуктов
		var str = "",
			temp = null,
			array = [];
		$(".products",".jqmWindow#product_list").empty();
		$this.parent().find("li[data-id]").each(function() {
			if ( temp = $(this).data("id") ) {
				array.push( temp );
			}
		})
		productsDB().each(function(obj) {
			str+="<input id=\"inpr_"+obj.id+"\" type=\"checkbox\" />" + "<label for=\"inpr_"+obj.id+"\">"+obj.name+"</label>";
		})
		if (str) {
			$(".products",".jqmWindow#product_list").append(str);	
		}
		if (array.length) {
			$.each(array, function(i, obj) {
				obj = $(".products",".jqmWindow#product_list").find("input#inpr_"+obj);
				obj.attr("checked", "checked");
			})
		}
		$(".jqmWindow#product_list").jqmShow();
		return;
	}
	var id = $(this).data("id");
	$this.toggleClass("red green");
	if (!id) return false;
	var finded_prod = productsDB({"id":id}).first();
	if (!finded_prod) return false;

})

$(".questions","#p1").on("click", "li", function(){
	var $this = $(this);
	if ($this.is(":last-child")) {
		var str = "",
			temp = null,
			array = [];
		$this.closest("ul").find("li[data-id]").each(function() {
			if ( temp = $(this).data("id") ) {
				array.push( temp );
			}
		})
		$(".questions",".jqmWindow#question_list").empty();
		questionsDB().each(function(obj) {
			str+="<input id=\"inqs_"+obj.id+"\" type=\"checkbox\" />" + "<label for=\"inqs_"+obj.id+"\">"+obj.text+"</label>";
		})
		if (str) {
			$(".questions",".jqmWindow#question_list").append(str);	
		}
		if (array.length) {
			$.each(array, function(i, obj) {
				obj = $(".questions",".jqmWindow#question_list").find("input#inqs_"+obj);
				obj.attr("checked", "checked");
			})
		}
		$(".jqmWindow#question_list").jqmShow();
		return
	}

})
$(function() {

	$(".jqmWindow").jqm();
	$(".jqmWindow .close_popup").on("click", function() {
		$(this).closest(".jqmWindow").jqmHide();
	})
	$(".save_popup").on("click", function() {
		$closest = $(this).closest(".jqmWindow");
		switch ( $closest.attr("id") ) { //определяем кнопка Сохранить какого диалогового окна нажата
			case "product_list":

var array = [];
$(".products",".jqmWindow#product_list").find(":checked").each(function(i, obj) {
	array.push( $(obj).attr("id").substr(5) );
})
$("#products","#p1").find("li[data-id]").each(function() {
	if ( !in_array( $(this).data("id"), array )  ) {
		$(this).remove();
	}
})
var str = "";
$.each(array, function(i, obj) {
	if ( $("#products","#p1").find("li[data-id="+obj+"]").length ) {
		return
	} else {
		var prod = productsDB({"id":obj}).first();
		if (!prod || !prod.name) return false;
		str+="<li data-id='"+prod.id+"' class='green'>"+prod.name+"</li>";
	}
})
$("#products","#p1").prepend(str);

		break;
		case "question_list":

var array = [];
$(".questions",".jqmWindow#question_list").find(":checked").each(function(i, obj) {
	array.push( $(obj).attr("id").substr(5) );
})
$(".questions","#p1").find("li[data-id]").each(function() {
	if ( !in_array( $(this).data("id"), array )  ) {
		$(this).remove();
	}
})
var str = "";
$.each(array, function(i, obj) {
	if ( $(".questions","#p1").find("li[data-id="+obj+"]").length ) {
		return
	} else {
		var question= questionsDB({"id":obj}).first();
		if (!question || !question.text) return false;
		str+="<li data-id=\"" + question.id + "\"><div><span class='first'>№</span><span class='second'>"+question.text+"</span></div></li>";
	}
})
if (!str) {
	return false;
}
$(".questions>li:last-child", "#p1").before(str);
var length =  $(".questions>li:last-child", "#p1").prevAll().length
$(".questions>li:last-child", "#p1").prevAll().each(function(st) {
	$(this).find(".first").html("№"+(length-st));
})

		break;
		case "product_edit":

var product_id = $(".jqmWindow#product_edit>.product").data("id");
if (!product_id) return false;
var product = productsDB({id:product_id}).first();
if (!product) return false;
productsDB({id:product_id}).update({name: $(".jqmWindow#product_edit>.product").find(".name").eq(0).val(), desc: $(".jqmWindow#product_edit>.product").find(".desc").eq(0).val()})
product = productsDB({id:product_id}).first();
$.extend(data.products, product);
reReadProducts();
sendAJAX();

		break;
		case "question_edit":

var question_id = $(".jqmWindow#question_edit>.question").data("id");
if (!question_id) return false;
var question = questionsDB({id:question_id}).first();
if (!question) return false;
var temp = {
	text: $(".jqmWindow#question_edit>.question").find(".text").eq(0).val(),
	answers: [$(".jqmWindow#question_edit>.question").find(".answer_0").eq(0).val(), $(".jqmWindow#question_edit>.question").find(".answer_1").eq(0).val()],
	difficult: $(".jqmWindow#question_edit>.question").find("select.difficult>option:selected").val()
};
questionsDB({id:question_id}).update(temp)
question = questionsDB({id:question_id}).first();
$.extend(data.questions, question);
reReadProducts();
sendAJAX();

		break;
		case "product_add":

var product = {
	id: "prod"+(++data.settings.product_last_id),
	name: $(".jqmWindow#product_add>.product").find(".name").eq(0).val(),
	desc: $(".jqmWindow#product_add>.product").find(".desc").eq(0).val()
}
productsDB.insert(product);
data.products = productsDB().get();
reReadProducts();
sendAJAX();

		break;
		case "question_add":

var question = {
	id: "v"+(++data.settings.question_last_id),
	text: $(".jqmWindow#question_add>.question").find(".text").eq(0).val(),
	answers: [$(".jqmWindow#question_add>.question").find(".answer_0").eq(0).val(), $(".jqmWindow#question_add>.question").find(".answer_1").eq(0).val()],
	difficult: $(".jqmWindow#question_add>.question").find("select.difficult>option:selected").val()
};
questionsDB.insert(question);
data.questions = questionsDB().get();
reReadQuestions();
sendAJAX();

		break;
		case "photo_list":

var pic = $(".jqmWindow#photo_list").find(".active");
if (!pic.length) return false;
$(".photo>img", "#p1 .left_column").attr("src", pic.attr("src"));

		break;
		default: 

return;

		}
		$(this).closest(".jqmWindow").jqmHide();
	});
	$(".top_column").on("click", ".add", function() {
		var tab = $(this).closest("[id^=p]").attr("id");
		if (tab=="p1") {
			curClient = client_data_new = new Client("Client_"+(++settingsDB.client_last_id));
			client_data_new.clearIn().writeIn();
		}
		if (tab=="p3") {
			$(".jqmWindow#product_add").jqmShow();
		}
		if (tab=="p4") {
			$(".jqmWindow#question_add").jqmShow();
		}
	}).on("click", ".remove", function() {
		clientsDB({id:curClient.id}).remove();
		//settingsDB.client_last_id-=1;
		data.settings = settingsDB;
		data.clients = clientsDB().get();
		$(".top_column", "#p1").find("#"+curClient.id).remove();
		sendAJAX();
	});
	$(".save", "#p2").on("click", function() {
		var id = null;
		data.settings.random_queue = $("#is_random_queue").hasClass("active");
		data.settings.queue = [];
		$("#drop","#p2").children("li").each(function() {
			if ( $(this).data("id") ) data.settings.queue.push( $(this).data("id") );
		})
		sendAJAX();
	});
	$("#prevClient").on("click", function() {
		var $current = $(this).closest(".top_column").find(".current");
			$clients = $(this).siblings(".clients").children("ul");

		if (!$current.length) return false;

		if ( ($current).is(":first-child") ) {
			$clients.animate({"margin-left": -(($clients.find(".client").length-3)*143) + "px"});
			$clients.find(".client:last-child").addClass("current").siblings(".current").removeClass("current");
		} else {
			$clients.animate({"margin-left": "+=143"});
			$clients.find(".current").removeClass("current").prev().addClass("current");
		}


	})
	$("#nextClient").on("click", function() {
		var $current = $(this).closest(".top_column").find(".current");
			$clients = $(this).siblings(".clients").children("ul");

		if (!$current.length) return false;

		if ( ($current).is(":last-child") ) {
			$clients.animate({"margin-left": "0"}, 700);
			$clients.find(".client:first-child").addClass("current").siblings(".current").removeClass("current");
		} else {
			$clients.animate({"margin-left": "-=143"}, 700);
			$clients.find(".current").removeClass("current").next().addClass("current");
		}
	})
	reReadProducts();
	reReadQuestions();

	$(".left_column", "#p1").on("click", ".photo>img", function() {
		$(".jqmWindow#photo_list").jqmShow();
	})

	$(".jqmWindow#photo_list").on("click", "img", function() {
		$(this).addClass("active").siblings().removeClass("active");
	})

	$(".client", "#p1 .top_column").eq(0).trigger("click");

	$.ajax({
		type: "POST",
		url: "server_functions.html",
		data: "op_type=01"
	}).done(function(msg) {
		if (msg) {
			var str = "";
			files = msg.split(":::");
			files.forEach(function(obj, st) {
				files[st] = obj.substr(29);
				str+="<img src='"+files[st]+"' />"
			})
			if (!str) return false;
			$(".jqmWindow#photo_list>.photos").append(str);
		}
	}).fail(function(msg) {
		console.log("Error: " + msg);
	})

	//drag'n'drop клиентов begin
	$( "ul#drag" ).sortable({
		connectWith: "ul#drop"
	});
	$( "ul#drop" ).sortable({
		connectWith: "ul#drag"
	});
	$("#drop, #drag").disableSelection();
    //drag'n'drop клиентов end

    $("#p1").on("change", "#mood", function() {
    	var $this = $(this),
    		value = $this.val();
    	if ( !parseInt(value) ) $this.val("0");
    	if ( parseInt(value)>100) $this.val("100");
    })
})

function urlencode(a){var b=[];for(var c=1040;c<=1103;c++)b[c]=c-848;b[1025]=168;b[1105]=184;var d=[];for(var c=0;c<a.length;c++){var e=a.charCodeAt(c);if(typeof b[e]!="undefined")e=b[e];if(e<=255)d.push(e)}return escape(String.fromCharCode.apply(null,d))}
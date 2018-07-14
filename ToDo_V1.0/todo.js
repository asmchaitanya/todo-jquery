$(document).ready(function(){

  var LIST_SAVE_MESSAGE = " Your Task List is Saved  ";
  var INVALID_TASKNAME_MESSAGE = " Enter The Task Name ";
  var LIST_CLEAR_MESSAGE = " Your Task List is Cleared ";


  $('.success-alert').hide();
  $('.warning-alert').hide();

  if(localStorage.getItem('todoList')!="undefined" && localStorage.length > 0) {
    var saved_tasks = JSON.parse(localStorage.getItem('todoList'));
    $('ul').html(saved_tasks);
    task_list_changes();
  } else {
    $('.pre-footer').addClass('hidden');
  }

  $('#add-task').click(function(){
      var taskname = $('#task-name').val();
      if($('#task-name').val() == '') {
        $("#warning-alert-message").html(INVALID_TASKNAME_MESSAGE);
        $('.warning-alert').show();
      }

      else {
        $('ul').append("<li class='list-group-item tl'><span id='task-title'>"+taskname+"</span><div class='task-actions'><a class='task-complete'><span class='glyphicon glyphicon-ok-sign'></span></a><span class='divider'>|</span><a class='task-delete'><span class='glyphicon glyphicon-trash'></span></a></div></li>");
        task_list_changes();
        $('#task-name').val('');
      }
    });

  $("#clear-all").click(function(){
    $("ul").empty();
    localStorage.clear();
    task_list_changes();
    $('#success-alert-message').html(LIST_CLEAR_MESSAGE);
    $('.success-alert').show();
  });


  $('.list-group').on('click','.task-delete',function(){
    $(this).parent().parent().remove();
    check_task_count();
  });

  $('.list-group').on('click','.task-complete',function(){
    $(this).find('.glyphicon-ok-sign').fadeOut(100).toggleClass("glyphicon-colour").fadeIn(1);
      $(this).parent().parent().toggleClass('task-title-style');
  });

  $('#save-all').on('click',function(){
      var listContents = [];
      var date = new Date();
      var list_save_timestamp = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
      listContents.push($('ul').html());
      localStorage.setItem('todoList',JSON.stringify(listContents));
      $('#success-alert-message').html(" "+LIST_SAVE_MESSAGE+"at "+list_save_timestamp+" with "+$('li').length+" task(s).");
      $('.success-alert').show();

  })

  $('#close-warning-alert').on('click',function(){
        $('.warning-alert').hide();
  });

  $('#close-success-alert').on('click',function(){
    $('.success-alert').hide();
  });


  function task_list_changes() {
    check_task_count();
    check_pre_footer();
  }

  function check_task_count() {
    $('#task-count').html($('li').length);
  }

  function check_pre_footer() {
    if($('li').length < 1) {
        $('.pre-footer').addClass('hidden');
    } else {
        $('.pre-footer').removeClass('hidden');
    }
  }
});

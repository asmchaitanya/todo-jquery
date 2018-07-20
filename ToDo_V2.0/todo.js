$(document).ready(function(){

  var LIST_SAVE_MESSAGE = " Your Task List is Saved  ";
  var INVALID_TASKNAME_MESSAGE = " Enter The Task Name ";
  var LIST_CLEAR_MESSAGE = " Your Task List is Cleared ";
  var NO_SAVED_TASKS = "You Don't Have Any Saved Tasks.Save your tasks and changes.";

  var dialog = document.querySelector('dialog');
  var showDialogButton = document.querySelector('#clear-all');
  var dialog_result;
  var task ={};
  var total_tasks = [];
  var saved_tasks = get_saved_tasks();
  if(localStorage.getItem('ToDo_Tasks')!=undefined && saved_tasks.length >0){
    total_tasks = saved_tasks;
  }

  if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  if(localStorage.getItem('todoList')!="undefined" && localStorage.length > 0) {
    for (var i = 0; i<saved_tasks.length; i++){
      create_card(saved_tasks[i]);
    }
  } else {
    $('.task-board-actions').hide();
  }
  $('#add-task').click(function(){
      task = {
          name: $('#task-name').val(),
          description: $('#task-description').val(),
          priority: $('input[name=priority]:checked').val(),
          dateToComplete: $('#task-date').val(),
          id: Math.floor(((Math.random()*100)+1)),
          status:0
      };
      total_tasks.push(task);
      if(task.name != "") {
          create_card(task);
          reset_form();
          set_toast("Task Created successfully");
          misc_change();
          $('.panel-body').slideToggle('fast');;
      }
  });

  $("#clear-all").click(function(){
      var title = "Want to clear all tasks";
      var dialog_content = "On Agree will clear the all you task list";
      localStorage.removeItem('ToDo_Tasks');
      make_dialog_content(title,dialog_content);
      dialog.showModal();
  });


  $('.task-view').on('click','#task-delete',function(){
      var req_task = $(this).closest('.task-cell');
      for (var t in total_tasks){
        if(req_task.attr('id') == total_tasks[t].id){
          total_tasks.splice(t,1);
        }
      }
      $(this).closest('.task-cell').remove();
      set_toast("Task deleted");
  });

  $('.task-view').on('click','.task-complete-icon',function(){
      var selected_task = $(this).closest('.task-cell');
      var selected_task_id = selected_task.attr('id');
      var i;
      $(this).fadeOut(100).toggleClass("task-complete-icon-change").fadeIn(1);
      $(this).hasClass("task-complete-icon-change") ? i = 1 :i = 0;
      set_task_status(i,selected_task_id);

  });

  $('#save-all').on('click',function(){
      var date = new Date();
      var list_save_timestamp = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
      localStorage.setItem('ToDo_Tasks',JSON.stringify(total_tasks));
      $('#success-alert-message').html(" "+LIST_SAVE_MESSAGE+"at "+list_save_timestamp+" with "+$('li').length+" task(s).");
      $('.success-alert').show();
      set_toast(LIST_SAVE_MESSAGE);
  });


//for mdl-test
  $('#task-name').keyup(function(){
    var te = $('#task-name').val();
    $('.test').html(te);
  })

  function make_dialog_content(title,content) {
    $('.mdl-dialog__title').html(title);
    $('.mdl-dialog__content').children('p').html(content);
  }

  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });

  dialog.querySelector('.accept-clear-btn').addEventListener('click', function() {
    clear_all_tasks();
    dialog.close();
  });

  function clear_all_tasks(){
    $('.task-view').empty();
    localStorage.removeItem('ToDo_Tasks');
    set_toast(LIST_CLEAR_MESSAGE);
    total_tasks = [];
    misc_change();
  }

  function set_toast(toast_message) {
    'use strict';
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = {message: toast_message };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }

  function get_task_style_class(priority_value) {
    if(priority_value =='Low')
      return "low-prior-task";
    else if(priority_value =='Medium')
      return "medi-prior-task";
    else
      return "high-prior-task";
  }

  function get_task_count(i){
    var count = 0;
    var saved_tasks = get_saved_tasks();
    for(var t in saved_tasks){
      if(saved_tasks[t].status == i){
        count++;
      }
    }
    return count;
  }

  function set_task_status(i,id){
    for(var t in total_tasks){
      if(total_tasks[t].id == id){
        total_tasks[t].status = i;
      }
    }
  }

  function reset_form(){
    $('#task-name').val('');
    $('#task-description').val('');
    $('#task-date').val('');
  }

  function create_card(t){
    var task_title_style = get_task_style_class(t.priority);
    var task_board = $('.task-view')
    $(task_board).append("<div class='mdl-cell mdl-cell--2-col task-cell' id ="+t.id+"><div class='demo-card-square mdl-card mdl-shadow--2dp '><div class='mdl-card__title task-title "+task_title_style+"'><h2 class='mdl-card__title-text'>"+t.name+"</h2></div><div class='mdl-card__supporting-text mdl-card--expand'>"+t.description+"</div><div class='mdl-card__supporting-text'> Finish By:"+t.dateToComplete+"</div><div class='mdl-card__actions mdl-card--border'><i class='material-icons task-complete-icon' id='task-complete'>assignment_turned_in</i><i class='material-icons task-delete-icon' id ='task-delete'>delete</i></div></div></div>");
    if(t.status == 1){
      $('.task-complete-icon').filter(":last").addClass('task-complete-icon-change');
    }
  }

  function get_saved_tasks(){
      return JSON.parse(localStorage.getItem('ToDo_Tasks'));
  }

  $('.task-form-panel').on('click','h3.panel-title',function(){
    $('.panel-body').slideToggle('fast');
  });

  function misc_change(){
    if(total_tasks.length > 0 || saved_tasks){
      $('.task-board-actions').show();
    } else{
      $('.task-board-actions').hide();
    }
  }

  $("#view-task-form").click(function() {
    $('.panel-body').slideDown('fast');
    $('.mdl-layout__content').animate({
        scrollTop: $("#task-name").offset().top
    }, 20);
  });


/* HighChart Data .......................................................................................................................................*/

var options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
          text: 'Over All Status Of The Tasks'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
          enabled: false
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.y}',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: 'Tasks',
          colorByPoint: true,
          data: [{
              name: 'Completed',
              y:0,
          }, {
              name: 'Todo',
              y: 0,
              sliced: true,
              selected: true
          }]
      }]
    };
    $('.stat-tab').on('click',function(){
      if(get_saved_tasks() != null){
        options.series[0].data[0].y = get_task_count(1);
        options.series[0].data[1].y = get_task_count(0);
        var chart = new Highcharts.Chart('container',options);
      }
    });

});

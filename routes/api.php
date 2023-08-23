<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentsController;
use App\http\Controllers\Api\EmployeesController;
use App\http\Controllers\Api\CollegeController;
use App\http\Controllers\Api\GlobalController;
use App\http\Controllers\Api\FacultyController;
use App\http\Controllers\Api\GroupController;
use App\http\Controllers\Api\ScheduleController;
use App\http\Controllers\Api\DepartmentController;
use App\http\Controllers\Api\InlineCommentController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'namespace' => 'API'  
], function() {
    Route::group([
        'middleware' => 'auth:api'
      ], function() {

        Route::group([ 'prefix' => 'students' ], function() {
            Route::post('student-list', [ StudentsController::class, 'index'] );
            Route::get('/thesis', [ StudentsController::class, 'thesis'] );

            Route::post('/', [ StudentsController::class, 'store'] );
            Route::post('/store-thesis-title', [ StudentsController::class, 'storeThesisTitle'] );
            Route::post('/update-thesis-doc', [ StudentsController::class, 'updateThesisDoc'] );
            //Route::post('/update-client', [ ClientController::class, 'updateClient'] );
        });

        Route::group([ 'prefix' => 'faculties' ], function() {
            Route::get('/', [ FacultyController::class, 'index'] );
            Route::post('/dashboard', [ FacultyController::class, 'dashboard'] );
            //Route::post('/thesis', [ FacultyController::class, 'thesis'] );
            Route::post('/store-comments', [ FacultyController::class, 'storeComments'] );
            Route::post('/', [ FacultyController::class, 'store'] );
            //Route::post('/update-thesis-doc', [ FacultyController::class, 'updateThesisDoc'] );
            Route::post('/update-group', [ FacultyController::class, 'updateThesisGroup'] );
            Route::post('/update-panel', [ FacultyController::class, 'updatePanel'] );
            Route::post('/rating', [ FacultyController::class, 'rating'] );
            Route::post('/store-concept-paper-rating', [ FacultyController::class, 'storeConceptPaperRating'] );
            Route::post('/rating-thesis-sched', [ FacultyController::class, 'ratingThesisSched'] );
            Route::get('/list-inline-comments/{id}', [ InlineCommentController::class, 'index'] );
        });

        Route::group([ 'prefix' => 'employees' ], function() {
            Route::get('/', [ EmployeesController::class, 'index'] );
            Route::post('/', [ EmployeesController::class, 'store'] );
        });
       
        Route::group([ 'prefix' => 'college' ], function() {
            Route::get('/', [ CollegeController::class, 'index'] );
            Route::post('/', [ CollegeController::class, 'store'] );
            Route::get('/departments/{id}', [ CollegeController::class, 'getDepartments'] );
            Route::post('/store-department', [ CollegeController::class, 'storeDepartment'] );
            Route::post('/store-thesis', [ CollegeController::class, 'storeThesis'] );
            Route::post('/store-SY', [ CollegeController::class, 'storeSY'] );
            Route::get('/department-list', [ CollegeController::class, 'getDepartmentList'] );
            Route::get('/college-list', [ CollegeController::class, 'getCollegetList'] );
        });

        Route::group([ 'prefix' => 'department' ], function() {
            Route::get('/', [DepartmentController::class, 'index'] );
            Route::post('/store-department', [ DepartmentController::class, 'storeDepartment'] );
        });

        Route::group([ 'prefix' => 'groups' ], function() {
            Route::get('/', [ GroupController::class, 'index'] );
            Route::get('/list', [ GroupController::class, 'list'] );
            Route::get('/thesis-group', [ GroupController::class, 'thesisGroup'] );
            Route::post('/', [ GroupController::class, 'store'] );
            Route::post('/create-account', [ GroupController::class, 'createAccount'] );
            Route::get('/faculty-group-list', [ GroupController::class, 'facultyGroupList'] );
        });

        Route::group([ 'prefix' => 'schedule' ], function() {
            Route::get('/', [ ScheduleController::class, 'index'] );
            Route::get('/report', [ ScheduleController::class, 'report'] );
            Route::post('/reports', [ ScheduleController::class, 'reports'] );
            Route::get('/get-proponents', [ ScheduleController::class, 'getProponents'] );
            Route::get('/schedule-view-details', [ ScheduleController::class, 'scheduleViewDetails'] );
            Route::get('/schedule-details-pdf', [ ScheduleController::class, 'schedDetailsPdf'] );

            Route::post('/create', [ ScheduleController::class, 'create'] );
            Route::post('/report-details', [ ScheduleController::class, 'reportDetails'] );
            Route::post('/report-total', [ ScheduleController::class, 'reportTotal'] );
            Route::post('/sched-details', [ ScheduleController::class, 'schedDetails'] );
            Route::post('/pdf', [ ScheduleController::class, 'pdf'] );
        });
        

        Route::group([ 'prefix' => 'thesis' ], function() {
            Route::post('/save-inline-comment', [ InlineCommentController::class, 'store'] );
            Route::get('/list-inline-comments/{id}', [ InlineCommentController::class, 'index'] );
            Route::post('/delete-inline-comment', [ InlineCommentController::class, 'delete'] );
            Route::post('/save-screen-record', [ FacultyController::class, 'saveScreenRecord'] );
        });
       

        Route::get('/schoolyear', [ GlobalController::class, 'getSchoolyears'] );
        Route::get('/semesters', [ GlobalController::class, 'getSemesters'] );
        // Route::get('/thesis', [ GlobalController::class, 'getThesis'] );
        Route::get('/thesis/details/{id}', [ GlobalController::class, 'getThesisDetails'] );
        Route::get('/thesis/document/{id}', [ GlobalController::class, 'getThesisDocument'] );
        Route::get('/faculty-list', [ GlobalController::class, 'facultyList'] );
        Route::get('/student-email-list/{id}', [ GlobalController::class, 'studentEmailList'] );
        Route::get('/thesis-stages', [ GlobalController::class, 'getThesisStages'] );
        Route::get('/notifications', [ GlobalController::class, 'notifications'] );
        Route::get('/update-notification', [GlobalController::class, 'updateNotification'] );
        Route::get('/dashboad-data', [ GlobalController::class, 'dashboadData'] );
        Route::get('/profile', [GlobalController::class, 'profile'] );

        Route::post('/student-search', [ GlobalController::class, 'studentSearch'] );
        Route::post('/update-thesis-group', [ GlobalController::class, 'updateThesisGroup'] );
        Route::post('/thesis', [ GlobalController::class, 'thesis'] );
        Route::post('/edit-personal-details', [ GlobalController::class, 'editPersonalDetails'] );
        Route::post('/edit-skills', [ GlobalController::class, 'editSkills'] );
        Route::post('/update-profile', [ GlobalController::class, 'updateProfile'] );
        Route::post('/edit-about', [ GlobalController::class, 'editAbout'] );
        Route::post('/edit-password', [ GlobalController::class, 'editPassword'] );

        
    });   
    
   
});



Route::post('/login', 'App\Http\Controllers\AuthController@login');

<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Semester;
use App\Models\Students;
use App\Models\Schoolyear;
use App\Models\Faculties;
use App\Models\Thesis;
use App\Models\Groups;
use App\Models\GroupDetails;
use App\Models\ThesisDoc;
use App\Models\ThesisComments;
use App\Models\ThesisStages;
use App\Models\DefenseShedule;
use App\Models\DefensePanel;
use App\Models\ScheduleDocuments;
use App\Models\Notifications;
use App\Models\Users;
use App\Models\Skills;
use App\Models\Thesislogs;
use Illuminate\Support\Facades\Hash;
use DB;
use URL;


class GlobalController extends Controller
{
    public function dashboadData()
    {
        $students = Users::where('role', '=', 'student')->count();
        $faculties = Users::where('role', '=', 'faculty')->count();
        $activeThesis = Thesis::where('status', '=', 'active')->count();
        $completedThesis = Thesis::where('status', '=', 'completed')->count();
        $inactiveThesis = Thesis::where('status', '=', 'inactive')->count();
        $schedules = DefenseShedule::select('defense_sched.*') ->where('end_date', '>=', date('Y-m-d'))->count();
        $new_groups = Groups::where('year_added', date("Y"))
        ->count();
        $groups = Groups::count();
        return response()->json(['result' => true, 'students' =>  $students, 'faculties' =>  $faculties, 'activeThesis' =>  $activeThesis, 'completedThesis' =>  $completedThesis, 'inactiveThesis' => $inactiveThesis, 'schedules' => $schedules, 'new_groups' => $new_groups, 'groups' => $groups], 200);
    }

    public function getSchoolyears()
    {
        $schoolyear = Schoolyear::orderBy('id', 'DESC')->get();
        return response()->json(['result' => true, 'schoolyear' =>  $schoolyear], 200);
    }

    public function getSemesters()
    {
        $semester = Semester::orderBy('id', 'ASC')->get();
        return response()->json(['result' => true, 'semesters' =>  $semester], 200);
    }

    public function getThesis()
    {
        $thesis = Thesis::where('status', 'active')->join('groups',  'groups.id', '=',  'thesis.group_id')
            ->select('thesis.id', 'thesis.thesis_name', 'groups.id as group_id', 'groups.group_name', 'groups.team_lead')
            ->orderBy('thesis.id', 'ASC')->get();
        return response()->json(['result' => true, 'thesis' =>  $thesis], 200);
    }

    public function getThesisDetails($id)
    {
        $thesis = Thesis::where('id', $id)->with('stage')->first();
        $user = auth('api')->user();
        if ($id == 0) {
            $user = auth('api')->user();
            $student = Students::where('user_id', $user->id)->first();
            $group = GroupDetails::where('student_id', $student->id)->first();
            $thesis = Thesis::where('group_id', $group->group_id)->with('stage')->first();
            
            if (!isset($thesis->id)) return response()->json(['result' => true, 'thesis' =>  null], 200);

            $id  = $thesis->id;
        }

        if (!$thesis) return response()->json(['result' => true, 'thesis' =>  null], 200);
        $thesis_logs = Thesislogs::where('thesis_id', $id)->get();
        $group = Groups::join('group_details',  'group_details.group_id', '=',  'groups.id')->where('groups.id', $thesis->group_id)->first();
        $group_students = GroupDetails::where('group_id',  $thesis->group_id)->get();
        $students = [];
        foreach ($group_students as  $key2 => $group_student) {
            $students[$key2] = Students::select('students.*', 'users.image')->join('users',  'users.id', '=',  'students.user_id')->where('students.id', $group_student->student_id)->first();
        }
        $docs = ThesisDoc::select('thesis_documents.*', 'thesis_comments.updated_at AS date_comment')->where('thesis_id', $id)->leftjoin('thesis_comments',  'thesis_comments.document_id', '=',  'thesis_documents.id')->with('student')->orderBy('thesis_documents.id', 'desc')->where('is_schedule', 'no')->get();
        
        $upcomming_schedule =  DefenseShedule::select('defense_sched.*', 'defense_thesis_details.id AS defense_sched_details_id', 'date_sched', 'time')
        ->where('end_date', '>=', date('Y-m-d'))
        ->where('thesis_id', $id)
        ->join('defense_thesis_details',  'defense_thesis_details.defense_sched_id', '=',  'defense_sched.id')
        ->with('category')
        ->get();
        foreach ($upcomming_schedule as  $key => $schedule) {
            $upcomming_schedule[$key]->panelist = DefensePanel::select('faculty.id AS faculty_id', 'faculty.fname', 'faculty.lname', 'faculty.mname', 'users.image', 'faculty.user_id AS user_id')
                ->where('defense_sched_details_id', $schedule->defense_sched_details_id)
                ->join('defense_panel_faculty',  'defense_panel_faculty.defense_panel_id', '=',  'defense_panel.id')
                ->join('faculty',  'faculty.user_id', '=',  'defense_panel_faculty.faculty_id')
                //->join('faculty',  'defense_panel_faculty.faculty_id', '=',  'faculty.id')
                ->join('users',  'users.id', '=',  'faculty.user_id')
                ->get();
            $upcomming_schedule[$key]->documents = ScheduleDocuments::where('schedule_id', $schedule->id)->with('document')->first();
        }
        $thesis['url'] = URL::to('/');

        return response()->json(['result' => true, 'thesis' =>  $thesis, 'group' => $group, 'students' => $students, 'docs' => $docs, 'schedules' => $upcomming_schedule,'thesis_logs'=>$thesis_logs,'user'=>$user,'thesis'=>$thesis], 200);
    }

    public function getThesisDocument($id)
    {
        $docs = ThesisDoc::where('id', $id)->first();
        $thesis = Thesis::where('id',$docs->thesis_id)->first(); 
        // $comments = ThesisComments::where('document_id', $docs->id)->first();
        // $thesis = Thesis::where('id', $docs->thesis_id)->first();
        $comments = ThesisComments::where('document_id', $docs->id)->first();
        $docs['url'] = URL::to('/');

        return response()->json(['result' => true, 'thesis' =>  $thesis, 'docs' => $docs, 'comments' => $comments], 200);
    }                                                                                                                                                                                                                                                                                                                    

    public function facultyList(Request $request)
    {
        $faculties = Faculties::get();
        return response()->json(['result' => true, 'faculties' =>  $faculties], 200);
    }

    public function studentList()
    {
        $students = Students::orderBy('id', 'ASC')->get();
        return response()->json(['result' => true, 'students' =>  $students], 200);
    }

    public function studentEmailList($id)
    {
        $emails = GroupDetails::join('students',  'students.id', '=',  'group_details.student_id')->where('group_id', $id)->get();
        return response()->json(['result' => true, 'emails' =>  $emails], 200);
    }

    public function studentSearch(Request $request)
    {
        if (!$request->keywords) {
            return response()->json(['result' => true, 'students' =>  []], 200);
        }
        $members = Students::where('fname', 'LIKE', '%' . $request->keywords . '%')->orWhere('Lname', 'LIKE', '%' . $request->keywords . '%')->orderBy('Lname', 'ASC')->get();
        $students = [];
        foreach ($members as $k) {
            $group = GroupDetails::leftJoin('students', 'students.id', '=', 'group_details.student_id')
                ->leftJoin('groups', 'groups.id', '=', 'group_details.group_id')
                ->where('students.id', $k->id)
                ->first();
            if ($group) {
                array_push($students,  (object)[
                    'id' => $k->id,
                    'name' => $k->fname . ' ' . $k->lname . ' ' . '(' . $group->group_name . ')',
                ]);
            }
            if (!$group) {
                array_push($students,  (object)[
                    'id' => $k->id,
                    'name' => $k->fname . ' ' . $k->lname,
                ]);
            }
        }
        return response()->json(['result' => true, 'students' =>  $students], 200);
    }

    public function facultySeacrh(Request $request)
    {
        if (!$request->keywords) {
            return response()->json(['result' => true, 'students' =>  []], 200);
        }
        $students = Students::where('fname', 'LIKE', '%' . $request->keywords . '%')->orWhere('Lname', 'LIKE', '%' . $request->keywords . '%')->orderBy('Lname', 'ASC')->get();
        return response()->json(['result' => true, 'students' =>  $students], 200);
    }

    public function getThesisStages(Request $request)
    {
        $thesis_stages = ThesisStages::orderBy('id', 'ASC')->get();
        return response()->json(['result' => true, 'stages' => $thesis_stages], 200);
    }

    public function updateThesisGroup(Request $request)
    {
        DB::beginTransaction();
        try {
            Thesis::where('id', $request->thesis_id)
                ->update([
                    'group_id' => $request->group_id
            ]);
            Thesislogs::create([
                "thesis_id" =>   $request->thesis_id,
                "log" =>  "Updated thesis group",
            ]);
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function thesis(Request $request)
    {
        $user = auth('api')->user();
        $faculty = Faculties::where('user_id', $user->id)->first();
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno - 1) * $no_of_records_per_page;
        $query_keywords = '';
        if (isset($request->filter['keywords'])) {
            $keywords = $request->filter['keywords'];
            $query_keywords = "AND CONCAT_WS('', thesis_name,group_name) LIKE '%$keywords%' ";
        }
        if ($user->role === 'admin') {
            $thesis  = DB::select('SELECT thesis.*, groups.group_name, groups.team_lead FROM thesis JOIN groups ON groups.id=thesis.group_id ' . $query_keywords . ' LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
        }
        if ($user->role === 'faculty') {
            $thesis  = DB::select('SELECT thesis.*, groups.group_name, groups.team_lead FROM thesis JOIN groups ON groups.id=thesis.group_id  where groups.faculty_id=' . $user->id . '' . $query_keywords . ' LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
        }
        foreach ($thesis as  $key => $k) {
            $group_students = GroupDetails::where('group_id', $k->group_id)->get();
            $students = [];
            foreach ($group_students as  $key2 => $group_student) {
                $students[$key2] = Students::select('students.*', 'users.image')->join('users',  'users.id', '=',  'students.user_id')->where('students.id', $group_student->student_id)->first();
            }
            $thesis[$key]->students = $students;
        }
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  thesis  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'thesis'     => $thesis,
            'url'           => URL::to('/'),
        );
        return response()->json($return, 200);
    }

    public function notifications(Request $request)
    {
        $user = auth('api')->user();
        $recipient = Users::where('id', $user->id)->first();
        // $notifications = Notifications::select('notifications.*', 'users.role')
        // ->leftJoin('users','users.id','=','notifications.user_id')
        // ->where('user_id',$recipient->id)
        // //->where('status','unseen')
        // ->get();
        // $notifications = Notifications::where('notification','schedToday')
        // ->where('user_id',$user->id)
        // ->delete();
        $sched_now_faculty = DefenseShedule::
        leftJoin('defense_thesis_details','defense_thesis_details.defense_sched_id','=','defense_sched.id')
        ->leftJoin('defense_panel','defense_panel.defense_sched_details_id','=','defense_thesis_details.id')
        ->leftJoin('defense_panel_faculty','defense_panel_faculty.defense_panel_id','=','defense_panel.id')
        ->where('date_sched',date('Y-m-d'))
        ->where('faculty_id', $user->id)
        ->get();

        $sched_now_student = DefenseShedule::
        leftJoin('defense_thesis_details','defense_thesis_details.defense_sched_id','=','defense_sched.id')
        ->leftJoin('thesis','thesis.id','=','defense_thesis_details.thesis_id')
        ->leftJoin('groups','groups.id','=','thesis.group_id')
        ->leftJoin('group_details','group_details.group_id','=','groups.id')
        ->leftJoin('students','students.id','=','group_details.student_id')
        ->where('date_sched',date('Y-m-d'))
        ->where('user_id', $user->id)
        ->get();

        foreach($sched_now_student as $k){
            $notifications=Notifications::where('notification','schedToday')
            ->where('user_id',$user->id)
            ->where('date_sched',date("Y-m-d"))
            ->first();
            if(!$notifications){
                $notifications=Notifications::create([
                    "user_id" =>   $k->user_id,
                    "notification" =>  'schedToday',
                    "user_id_from" =>  0,
                    "date_sched" =>  $k->date_sched,
                    "status" =>  'unseen'
                ]);
            }
           
        }
       
        foreach($sched_now_faculty as $k){
            $notifications=Notifications::where('notification','schedToday')
            ->where('user_id',$user->id)
            ->where('date_sched',date("Y-m-d"))
            ->first();
            if(!$notifications){
                $notifications=Notifications::create([
                    "user_id" =>   $k->faculty_id,
                    "notification" =>  'schedToday',
                    "user_id_from" =>  0,
                    "date_sched" =>  $k->date_sched,
                    "status" =>  'unseen'
                ]);
            }
           
        }
        $notifications = Notifications::select('notifications.*', 'users.role',)
        ->leftJoin('users','users.id','=','notifications.user_id')
        // ->leftJoin('students','students.user_id','=','users.id', 'As', 'recipient')
        // ->leftJoin('group_details','group_details.student_id','=','students.id')
        // ->leftJoin('groups','groups.id','=','group_details.group_id')
        // ->leftJoin('thesis','thesis.group_id','=','groups.id')
        // ->leftJoin('defense_thesis_details','defense_thesis_details.thesis_id','=','thesis.id')
        ->where('notifications.user_id',$user->id)
        // ->where('notifications.status','unseen')
        ->groupBy('notifications.created_at')
        ->orderBy('notifications.created_at', 'ASC')
        ->get();
        $notifications_unseen = Notifications::select('notifications.*', 'users.role', 'groups.group_name')
        ->leftJoin('users','users.id','=','users.id')
        ->leftJoin('students','students.user_id','=','users.id')
        ->leftJoin('group_details','group_details.student_id','=','students.id')
        ->leftJoin('groups','groups.id','=','group_details.group_id')
        ->where('notifications.user_id',$user->id)
        // ->where('notifications.user_id_from','!=',0)
        ->where('notifications.status','unseen')
        ->groupBy('notifications.created_at')
        ->get();

        // foreach( $notifications as $k){
        foreach ($notifications as $i=>   $not) { 
            if($not->user_id_from!=0){
                $notifications[$i]->user_from =$not->user_id_from;
                $group_name = GroupDetails::select('group_details.*', 'groups.group_name','thesis.id as thesis_id')
                //leftJoin('users','users.id','=','group.id')
                ->leftJoin('students','students.id','=','group_details.student_id')
                ->leftJoin('users','users.id','=','students.user_id')
                //leftJoin('group_details','group_details.student_id','=','students.id')
                // ->leftJoin('users','users.id','=','students.user_id')
                ->leftJoin('groups','groups.id','=','group_details.group_id')
                ->leftJoin('thesis','thesis.group_id','=','groups.id')
                ->where('users.id',$not->user_id_from)
                ->first();
                $notifications[$i]->group_name = $group_name->group_name;
                $notifications[$i]->thesis_id = $group_name->thesis_id;
            }
        }
       
        //return ($notifications_unseen);
        $return = array(
            'notifications'         => $notifications,
            'notificationsCount'         => sizeOf($notifications),
            'notificationsCountUnseen'         => sizeOf($notifications_unseen),
        );
        return response()->json($return, 200);
    }
    
    public function updateNotification(Request $request)
    { 
        try {
            Notifications::where('id', $request->id)
                ->update(['status' => 'seen']);
            DB::commit();
        
            return response()->json(['result' => true, 'message' => "updated!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function profile()
    {
        $user = auth('api')->user();
        $user_id= Users::where('id',$user->id)->first();
        if($user->role==="student"){
            $profile = Students::where('students.user_id',$user_id->id)
            ->first();
            $skills = Skills::where('user_id',$user_id->id)
            ->first();
            $skills_array=[];
            if(isset($skills)){
                $skills_array=explode(",", $skills->skill);
            }
            
        }
        if($user->role==="faculty"){
            $profile = Faculties::where('faculty.user_id',$user_id->id)
            ->first();
            $skills = Skills::where('user_id',$user_id->id)
            ->first();
            $skills_array=[];
            if(isset($skills)){
                $skills_array=explode(",", $skills->skill);
            }
        }
        return response()->json(['result' => true, 'profile' =>  $profile, 'skills' =>  $skills, 'skills_array' =>  $skills_array, 'user' =>  $user_id], 200);
    }
    
    public function editPersonalDetails(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = auth('api')->user();
            if($user->role==="student"){
                Students::where('id', $request->id)
                    ->update([
                        'fname' => $request->fname,
                        'lname' => $request->lname,
                        'mname' => $request->mname,
                        'dob' => $request->dob,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'address' => $request->address,
                ]);
            }
            if($user->role==="faculty"){
                Faculties::where('id', $request->id)
                    ->update([
                        'fname' => $request->fname,
                        'lname' => $request->lname,
                        'mname' => $request->mname,
                        'dob' => $request->dob,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'address' => $request->address,
                ]);
            }
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function editSkills(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = auth('api')->user();
            $skills=implode(",", $request->skills);
            if($request->id==null){
                Skills::create([
                    "user_id" =>  $request->user_id,
                    "skill" =>  $skills,
                ]);
            }
            if($request->id!=null){
                Skills::where('id', $request->id)
                    ->update([
                        "user_id" =>  $request->user_id,
                        "skill" =>  $skills,
                ]);
            }
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
        
    }

    public function updateProfile(Request $request)
    {
        DB::beginTransaction();
        try {
            // $user = auth('api')->user();
            // $skills=implode(",", $request->skills);
            // if($request->id==null){
            //     Skills::create([
            //         "user_id" =>  $request->user_id,
            //         "skill" =>  $skills,
            //     ]);
            // }
            // if($request->id!=null){
            //     Skills::where('id', $request->id)
            //         ->update([
            //             "user_id" =>  $request->user_id,
            //             "skill" =>  $skills,
            //     ]);
            // }
            $student_check = Students::where('user_id',$request->user_id)->first();
            if(!$student_check){
                return response()->json([ 'result' => false, 'message' => "Data did not mactch!" ], 500);
            }
            $user_check = Users::where('id',$student_check->user_id)->first();
           
            if($request->hasFile('image')){
                $image = $request->file('image');
                $image_name =  $image->getClientOriginalName();
                $fileName =  "profile-" .rand(). time() . '.' . $image->getClientOriginalExtension();
                $var_image = trim($user_check->image); 
                if( isset($var_image) === true && $var_image !== '' ) { 
                    $fileName = $user_check->image;
                }
                $image->move(public_path('uploads/profile'), $fileName);
                $user = new Users();
                $user->exists = true;
                $user->id = $user_check->id; 
                $user->image = $fileName; 
                $user->save();
            }
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
        
    }

    public function editAbout(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = auth('api')->user();
            if($user->role==="student"){
                Students::where('id', $request->id)
                    ->update([
                        'about' => $request->about,
                ]);
            }
            if($user->role==="faculty"){
                Faculties::where('id', $request->id)
                    ->update([
                        'about' => $request->about,
                ]);
            }
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function editPassword(Request $request)
    {
        DB::beginTransaction();
            $user=Users::where('id',$request->user_id)->first();
            if(password_verify($request->user_curr_pass,$user->password))
            {
                try { 
                    $data = Users::find($request->user_id);
                    $data->password    = bcrypt($request->new_pass);
                    $data->save();
                    DB::commit();
                    return response()->json(['success' => true, 'message' => "Saved"],200);
                } catch(\Illuminate\Database\QueryException $ex){ 
                    return response()->json(['success' => false, 'message' => $ex->getMessage()],500);
                }
            }
            if(!password_verify($request->user_curr_pass,$user->password))
            {
                return 'wrongPass';
            }
            
           
    }
}

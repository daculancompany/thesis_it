<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\User;
use App\Models\Users;
use App\Models\Groups;
use App\Models\Thesis;
use App\Models\ThesisDoc;
use App\Models\ScheduleDocuments;
use App\Models\Notifications;
use App\Models\DefenseShedule;
use App\Models\Thesislogs;
use DB;


class StudentsController extends Controller
{

    public function index(Request $request)
    {   
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno-1) * $no_of_records_per_page;
        $query_keywords = '';
        if(isset($request->filter['keywords'])){ 
            $keywords = $request->filter['keywords'];
            $query_keywords = "AND CONCAT_WS('', fname, lname, mname, users.email) LIKE '%$keywords%' ";
        }
        $query_college = '';
        if(isset($request->filter['college_id'])){ 
            $college_id = $request->filter['college_id'];
            $query_college = 'AND college_id='.$college_id.' ';
        }

        $query_department = '';
        if(isset($request->filter['department_id'])){ 
            $department_id = $request->filter['department_id'];
            $query_department = 'AND department_id='.$department_id.' ';
        }

        $list  = DB::select('SELECT  students.*,users.email, users.image,department.dept_name FROM students  INNER JOIN users ON students.user_id = users.id  JOIN department ON students.department_id = department.id   JOIN college ON department.college_id  =  college.id WHERE users.id != 0 '.$query_keywords.'  '.$query_college.' '.$query_department.'  LIMIT     '.$offset.', '.$no_of_records_per_page.' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  students INNER JOIN users ON students.user_id = users.id  JOIN department ON students.department_id = department.id  JOIN college ON department.college_id  =  college.id WHERE users.id != 0 '.$query_keywords.'  '.$query_college.' '.$query_department.'  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'students'      => $list,
            '$query_keywords ' => $query_keywords ,
        );
        return response()->json($return, 200);
    }

    public function store(Request $request)
    {    
        DB::beginTransaction();
        $check = Users::whereEmail($request->email)->first();

        if($check){
            if($check->id!=$request->user_id){
                return response()->json([ 'result' => false, 'message' => "Email is not available!" ], 500);
            }
        }
        $fname=strtoupper($request->fname);
        $lname=strtoupper($request->lname);
        $mname='';
        if(isset($request->mname)){
            if($request->mname!='undefined')
            $mname=strtoupper($request->mname);
        }
       
        $phone='';
        if(isset($request->phone)){
            if($request->phone!='undefined')
            $phone=strtoupper($request->phone);
        }
        try {
            
            if(isset($request->id) ){
                $student_check = Students::where('id',$request->id)->first();
                if(!$student_check){
                    return response()->json([ 'result' => false, 'message' => "Data did not mactch!" ], 500);
                }
                $user_check = Users::where('id',$student_check->user_id)->first();

                Students::where('user_id', $request->user_id)
                ->update([
                    'fname' => $request->fname,
                    'mname' => $mname,
                    'lname' => $request->lname,
                    'phone' => $phone,
                    'email' => $request->email,
                    'college_id' => $request->college_id,
                    'department_id' => $request->department_id,
                ]);

                Users::where('id', $request->user_id)
                ->update([
                    'email' => $request->email,
                    "name" => $fname . ' ' . $lname,
                ]);

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
                return 'updated';
            }
            
            $fileName = '';
            if($request->hasFile('image')){
                $image = $request->file('image');
                $image_name = $image->getClientOriginalName();
                $fileName =  "profile-" .rand(). time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/profile'), $fileName);
                
            }
            $user = Users::create([
                "name" => $fname . ' ' . $lname,
                "email" => $request->email,
                "role" => 'student',
                "image" => $fileName,
                "password" => bcrypt('password123'),//$request->password
            ]);
            Students::create([
               "user_id" => $user->id,
               "fname" => $fname,
               "lname" => $lname,
               "mname" => $mname,
               "phone" => $phone,
               "email" => $request->email,
               "college_id" => $request->college_id,
               "department_id" => $request->department_id,
            ]);
           DB::commit();
         return 'created';
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 500);
        }
    }
    
    public function thesis(Request $request)
    {
        $thesis = Thesis::join('groups',  'groups.id', '=',  'thesis.group_id')
        ->select('thesis.id','thesis.thesis_name','groups.id as group_id', 'groups.group_name')
        ->first();
        //$list  = DB::select('SELECT thesis.*, group_name, groups.id AS group_id FROM thesis LEFT JOIN thesis_groups ON thesis_groups.thesis_id = thesis.id LEFT JOIN groups ON
        //$list  = DB::select('SELECT thesis.*, group_name, groups.id AS group_id FROM thesis LEFT JOIN groups ON groups.id=thesis.group_id where user_id='.$id.''); 
        $return = array(
            'thesis'      => $thesis,
        );
        return response()->json($return, 200);
    }
    
    public function storeThesisTitle(Request $request)
    {
        DB::beginTransaction();
            try {
                DB::table('thesis')
                ->where('id',$request->thesis_id)
                ->update([
                    'thesis_name'     => $request->title,
                ]);
                Thesislogs::create([
                    "thesis_id" =>   $request->thesis_id,
                    "log" =>  "Updated thesis title",
                ]);
                DB::commit();
                    return response()->json([ 'result' => true, 'message' => "Service updated" ], 200);
                }catch (\Exception $e) {
                    DB::rollback();
                    return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 400);
                }
            
    }

    public function updateThesisDoc(Request $request)
    {
        $user = auth('api')->user();
        $student = Students::where('user_id',$user->id)->first();
        // $documents = ThesisDoc::where('student_id',$student->id)->first();
        // $thesis = Thesis::where('id',$documents->thesis_id)->first();
        DB::beginTransaction();
        try {
            $document = $request->document;
            $fileName =  "doc-" . time() . '.' . $document->getClientOriginalExtension();
            $document_name =  $document->getClientOriginalName();
            $thesis_doc = ThesisDoc::create([
                "student_id" => $student->id,
                "notes" =>  isset($request->notes) ? $request->notes : "",
                "thesis_id" => $request->id,
                "document" => $fileName,
                "document_name" => $document_name,
                "is_schedule" => $request->isSchedule !== 'null' ? 'yes' : 'no'
             ]);
            $document->move(public_path('uploads/documents'), $fileName);
            $thesis = ThesisDoc::where('thesis_documents.id',$thesis_doc->id)
            ->leftJoin('thesis','thesis.id','=','thesis_documents.thesis_id')
            ->first();
            $user = auth('api')->user();
            $notifications=Notifications::create([
                "user_id" =>$thesis->faculty_id,
                "user_id_from" =>  $user->id,
                "notification" =>  'newUploadDoc',
                "status" =>  'unseen'
            ]);
          
            if($request->isSchedule !== 'null'){
                $shedule_doc=ScheduleDocuments::create([
                    "thesis_doc_id" => $thesis_doc->id,
                    "schedule_id" => $request->isSchedule,
                ]);
                // $panels = ScheduleDocuments::where('id',$shedule_doc->id)
                // ->leftJoin('defense_sched','defense_sched.id','=','schedule_documents.schedule_id')
                // ->leftJoin('defense_panel','defense_panel.defense_sched_details_id','=','defense_sched.id')
                // ->leftJoin('defense_panel_faculty','defense_panel_faculty.defense_panel_id ','=','defense_panel.id')
                // ->get();
                // $user = auth('api')->user();
                // $notifications=Notifications::create([
                //     "user_id" =>$thesis->faculty_id ,
                //     "user_id_from" =>  $user->id,
                //     "notification" =>  'newUploadDoc',
                //     "status" =>  'unseen'
                // ]);
            }

            Thesislogs::create([
                "thesis_id" =>  $request->id,
                "log" =>  "Proponent uploaded document",
            ]);
            
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }
}


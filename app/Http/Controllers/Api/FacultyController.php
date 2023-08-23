<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ThesisGroups;
use App\Models\Faculties;
use App\Models\Users;
use App\Models\Thesis;
use App\Models\Students;
use App\Models\ThesisComments;
use App\Models\GroupDetails;
use App\Models\DefenseShedule;
use App\Models\DefensePanel;
use App\Models\DefensePanelFaculty;
use App\Models\ThesisDoc;
use App\Models\ScheduleDocuments;
use App\Models\ConceptPaperRating;
use App\Models\DefenseThesisDetails;
use App\Models\Groups;
use App\Models\Notifications;
use App\Models\Thesislogs;
use DB;
use URL;

class FacultyController extends Controller
{

    public function index(Request $request)
    {
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno - 1) * $no_of_records_per_page;
        $keyword = $request->keyword;
        $filters_query = '';
        if ($keyword) {
            $filters_query =  "AND   CONCAT(faculty.fname, faculty.id) LIKE '%{$keyword}%' ";
        }
        $list  = DB::select('SELECT  faculty.*, users.email, users.image  FROM faculty INNER JOIN users ON faculty.user_id = users.id where users.role="faculty" ' . $filters_query . ' LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  faculty INNER JOIN users ON faculty.user_id = users.id where users.role="faculty"   ' . $filters_query . ' ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'faculties'     => $list,
            'url'           => URL::to('/'),
        );

        return response()->json($return, 200);
    }

    public function dashboard()
    {
        $user = auth('api')->user();
        $faculty = Faculties::where('user_id',$user->id)->first();
        $scedules = DefenseShedule::select('defense_sched.*','defense_thesis_details.id AS defense_thesis_details_ID','defense_thesis_details.thesis_id','thesis.thesis_name') 
        ->join('defense_thesis_details', 'defense_sched.id', '=', 'defense_thesis_details.defense_sched_id')
        ->join('defense_panel', 'defense_thesis_details.id', '=', 'defense_panel.defense_sched_details_id')
        ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
        ->join('thesis', 'thesis.id', '=', 'defense_thesis_details.thesis_id')
        ->where('defense_panel_faculty.faculty_id',$faculty->user_id)
        ->where('end_date', '>=', date('Y-m-d'))
        ->with('sched_details')
        ->with('category')
        // ->groupBy('defense_sched.id')
        ->get();

        foreach($scedules as $i=> $scedule){
            $scedules[$i]->thesis = Thesis::where('id', $scedule->thesis_id)->first();
            $scedules[$i]->document = ThesisDoc::where('thesis_id', $scedule->thesis_id)->first();
            $scedules[$i]->defense_thesis_details = DefenseThesisDetails::select('defense_thesis_details.id','date_sched','time')->where('defense_sched_id', $scedule->id)->first();
            $rating_perSched = ConceptPaperRating::where('defense_thesis_details_id',$scedule->defense_thesis_details_ID)->where('thesis_id',$scedule->thesis_id)->get();
            $research_topic= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->defense_thesis_details_ID)->sum('research_topic');
            $relevant_literature= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->defense_thesis_details_ID)->sum('relevant_literature');
            $issues_gap= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->defense_thesis_details_ID)->sum('issues_gap');
            $possibe_solutions= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->defense_thesis_details_ID)->sum('possibe_solutions');
            $overall_concept= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->defense_thesis_details_ID)->sum('overall_concept');
            $total_panel = DefensePanel::select('defense_panel.*') 
            ->join('defense_panel_faculty', 'defense_panel_id', '=', 'defense_panel.id')
            ->where('defense_sched_details_id',$scedule->defense_thesis_details_ID)
            ->get();
            $rating_sum=$research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;
            $rating_average=$rating_sum/sizeOf($total_panel);
            $color='';
            $remark='';
            if(sizeOf($total_panel)==sizeOf($total_panel)){
                if($rating_average>=75){
                    $color='green';
                    $remark='PASSED';
                }
                if ($rating_average < 75) {
                    $color = 'red';
                    $remark = 'FAILED';
                }
            }
            $scedules[$i]->panels = DefensePanel::select('faculty.*','users.image','defense_panel.defense_sched_details_id')->where('defense_sched_details_id', $scedule->defense_thesis_details_ID)
                        ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
                        ->join('users', 'users.id', '=', 'defense_panel_faculty.faculty_id')
                        ->join('faculty', 'faculty.user_id', '=', 'users.id')
                            // ->join('users', 'users.id', '=', 'faculty.user_id')
                        ->get();

            $scedules[$i]->remark = $remark;
            $scedules[$i]->color = $color;
            $scedules[$i]->rating_average = $rating_average;
            $scedules[$i]->rating_perSched = $rating_perSched;
            $scedules[$i]->total_panel_has_rating = sizeOf($rating_perSched);
            $scedules[$i]->total_panel =sizeOf($total_panel);
            $scedules[$i]->rating_perSched =$rating_perSched;
            
        }

        
                
        $schedule_list = [];
        // foreach ($scedules as  $key => $scedule) { 
        //     foreach ($scedule->sched_details as  $key2 => $sched_detail) { 
        //         $rating_perSched = ConceptPaperRating::where('defense_thesis_details_id',$scedule->id)->get();
        //         $research_topic= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->id)->sum('research_topic');
        //         $relevant_literature= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->id)->sum('relevant_literature');
        //         $issues_gap= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->id)->sum('issues_gap');
        //         $possibe_solutions= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->id)->sum('possibe_solutions');
        //         $overall_concept= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$scedule->id)->sum('overall_concept');
        //         $total_panel = DefenseShedule::select('defense_sched.*','defense_thesis_details.id AS defense_thesis_details_ID') 
        //         ->join('defense_thesis_details', 'defense_sched.id', '=', 'defense_thesis_details.defense_sched_id')
        //         ->join('defense_panel', 'defense_thesis_details.id', '=', 'defense_panel.defense_sched_details_id')
        //         ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
        //         ->where('defense_sched.id',$scedule->id)
        //         ->get();
        //         $rating_sum=$research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;
        //         $rating_average=$rating_sum/sizeOf($total_panel);
        //         $color='';
        //         $remark='';
        //         if($rating_average>=75){
        //             $color='green';
        //             $remark='PASSED';
        //         }
        //         if($rating_average<75){
        //             $color='red';
        //             $remark='FAILED';
        //         }
        //         $category=Thesis::where('thesis.id', $sched_detail->thesis_id)
        //         ->join('thesis_stages','thesis_stages.id','=','thesis.stage_id')
        //         ->first();
        //         array_push($schedule_list, (object)[
        //             'thesis' => Thesis::select('thesis_name')->where('id', $sched_detail->thesis_id)->first(),
        //             'doc' => ScheduleDocuments::with('document')->where('schedule_id',$scedule->id)->first(),
        //             'panels' => DefensePanel::select('faculty.*','users.image')->where('defense_sched_details_id', $scedule->defense_thesis_details_ID)
        //                 ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
        //                 ->join('users', 'users.id', '=', 'defense_panel_faculty.faculty_id')
        //                 ->join('faculty', 'faculty.user_id', '=', 'users.id')
        //                 // ->join('users', 'users.id', '=', 'faculty.user_id')
        //                 ->get(),
        //             'ratings' => ConceptPaperRating::select('concept_paper_rating.*')->where('defense_thesis_details_id', $scedule->id)
        //                 ->get(),
        //             'details' => $scedule,
        //             'color'=>$color,
        //             'remark'=>$remark,
        //             'rating_sum'     => $rating_sum,
        //             'total_panel_has_rating'   => sizeOf($rating_perSched),
        //             'total_panel'               =>sizeOf($total_panel),
        //             'rating_average'     => $rating_average,
        //             'category'     =>  $category->name,
        //         ]);
        //     }
        // }
        $docs = ThesisDoc::select('thesis_documents.*','thesis_comments.updated_at AS date_comment')->whereNull('thesis_comments.updated_at')->where('is_schedule','no')->leftjoin('thesis_comments',  'thesis_comments.document_id', '=',  'thesis_documents.id')->with('student')->orderBy('thesis_documents.id','desc')->get();
        //$newAddedgroups  = DB::select('SELECT * FROM groups where faculty_id='.$user->id.'   AND  year_added ='.date("Y").'');
        $group_list = Groups::where('faculty_id', $user->id)
            ->where('year_added', date("Y"))
            ->get();
        foreach ($group_list as  $key => $k) {
            $group_students = GroupDetails::where('group_id', $k->id)->get();
            $students = [];
            foreach ($group_students as  $key2 => $group_student) {
                $students[$key2] = Students::select('students.*', 'users.image')->join('users',  'users.id', '=',  'students.user_id')->where('students.id', $group_student->student_id)->first();
            }
            $group_list[$key]->students = $students;
        }

        $return = array(
            'schedules'      => $scedules,
            'docs' => $docs,
            'newAddedgroups'      => $group_list,
            'id'      => $user->id,
            'sched' => $scedules,
        );
        return response()->json($return, 200);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        $check = Users::whereEmail($request->email)->first();

        if ($check) {
            if ($check->id != $request->user_id) {
                return response()->json(['result' => false, 'message' => $check->id . $request->user_id], 500);
            }
        }
        $fname = strtoupper($request->fname);
        $lname = strtoupper($request->lname);
        $mname = '';
        if (isset($request->mname)) {
            if ($request->mname != 'undefined')
                $mname = strtoupper($request->mname);
        }

        $phone = '';
        if (isset($request->phone)) {
            if ($request->phone != 'undefined')
                $phone = strtoupper($request->phone);
        }

        try {

            if (isset($request->id)) {
                $student_check = Faculties::where('id', $request->id)->first();
                if (!$student_check) {
                    return response()->json(['result' => false, 'message' => "Data did not mactch!"], 500);
                }
                $user_check = Users::where('id', $student_check->user_id)->first();

                Faculties::where('user_id', $request->user_id)
                    ->update([
                        'fname' => $request->fname,
                        'mname' => $mname,
                        'lname' => $request->lname,
                        'phone' => $phone,
                    ]);

                Users::where('id', $request->user_id)
                    ->update([
                        'email' => $request->email,
                        "name" => $fname . ' ' . $lname,
                    ]);

                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    $image_name =  $image->getClientOriginalName();
                    $fileName =  "profile-" . rand() . time() . '.' . $image->getClientOriginalExtension();
                    $var_image = trim($user_check->image);
                    if (isset($var_image) === true && $var_image !== '') {
                        $fileName = $user_check->image;
                    }
                    $image->move(public_path('uploads/profile'), $fileName);

                    Users::where('id', $request->id)
                        ->update([
                            'image' => $fileName,
                        ]);
                }
                DB::commit();
                return 'updated';
            }
            $fileName = '';
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $image_name = $image->getClientOriginalName();
                $fileName =  "profile-" . rand() . time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/profile'), $fileName);
            }
            $user = Users::create([
                "name" => $fname . ' ' . $lname,
                "email" => $request->email,
                "image" => $fileName,
                "role" => 'faculty',
                "password" => bcrypt('password123'), //$request->password
            ]);
            Faculties::create([
                "user_id" => $user->id,
                "fname" => $fname,
                "lname" => $lname,
                "mname" => $mname,
                "phone" => $phone,
            ]);
            DB::commit();
            return 'created';
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function storeComments(Request $request)
    {
        // $user = auth('api')->user();
        // $faculty = Faculties::where('user_id',$user->id)->first();
        $comment_check = ThesisComments::where('document_id', $request->document_id)->first();
        $doc=ThesisDoc::where('id', $request->document_id)->first();
        DB::beginTransaction();
        
        try {
            if ($comment_check) {
                ThesisComments::where('document_id', $request->document_id)
                ->update(['comment' => $request->comment]);

                Thesislogs::create([
                    "thesis_id" =>   $doc->thesis_id,
                    "log" =>  "Faculty Updated Comments",
                ]);
                DB::commit();
                return response()->json(['result' => true, 'message' => "updated!"], 200);
            }
            $comment = new ThesisComments();
            $comment->comment = $request->comment;
            $comment->document_id = $request->document_id;
            // $comment->thesis_id = $request->thesis_id;
            // $comment->faculty_id = $faculty->id;
            $comment->save();

            Thesislogs::create([
                "thesis_id" =>   $doc->thesis_id,
                "log" =>  "Faculty Added Comments",
            ]);
            DB::commit();
            return response()->json(['result' => true, 'message' => "Saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateThesisDoc(Request $request)
    {
        DB::beginTransaction();
        try {
            $document = $request->document;
            $fileName =  "doc-" . time() . '.' . $document->getClientOriginalExtension();
            $document_name =  $document->getClientOriginalName();
            Thesis::where('id', $request->id)
                ->update(['document' => $fileName, 'document_name' => $document_name]);
            $document->move(public_path('uploads/documents'), $fileName);
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
            $query_keywords = "AND CONCAT_WS('', thesis_name) LIKE '%$keywords%' ";
        }
        $thesis  = DB::select('SELECT thesis.*, groups.group_name FROM thesis JOIN groups ON groups.id=thesis.group_id  where groups.faculty_id=' . $user->id . '' . $query_keywords . ' LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
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

    public function updateThesisGroup(Request $request)
    {
        DB::beginTransaction();
        try {
            $groups = ThesisGroups::where('thesis_id', $request->thesis_id)->first();
            if (!$groups) {
                ThesisGroups::create([
                    "thesis_id" => $request->thesis_id,
                    "group_id" => $request->group_id,
                ]);
                DB::commit();
                return response()->json(['result' => true, 'message' => "updated!"], 200);
            }
            ThesisGroups::where('thesis_id', $request->thesis_id)
                ->update(['group_id' => $request->group_id]);
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updatePanel(Request $request)
    {
        DB::beginTransaction();
        try {
            $panel = DefensePanel::where('defense_sched_details_id', $request->defense_sched_details_id)->first();
            $sched = DefenseThesisDetails::where('id', $request->defense_sched_details_id)->first();
            $thesis=Thesis::where('id', $sched->thesis_id)->first();
            $faculty=[];
            $faculty =  $request->faculty;
            if(!isset($panel)){
                $panel  = DefensePanel::create([
                    "defense_sched_details_id" => $request->defense_sched_details_id,
                ]);
            }
            //$faculty=Faculty::where('id', $thesis->faculty_id)->first();
            // if (!$panel) {
            //     $panel = DefensePanel::create([
            //         "defense_sched_details_id" => $request->defense_sched_details_id,
            //     ]);
            // } else {
            //     DefensePanelFaculty::where('defense_panel_id', $panel->id)->delete();
            // }
            DefensePanelFaculty::where('defense_panel_id', $panel->id)->delete();
            DefensePanelFaculty::create([
                "faculty_id" => $thesis->faculty_id,
                "defense_panel_id" => $panel->id,
            ]);
           
            for ($i=0; $i < count($faculty); $i++) { 
                if($faculty[$i]!=$thesis->faculty_id){
                    DefensePanelFaculty::create([
                        "faculty_id" =>  $faculty[$i],
                        "defense_panel_id" => $panel->id,
                    ]);
                }
            }

            Thesislogs::create([
                "thesis_id" =>   $sched->thesis_id,
                "log" =>  "Updated panelist",
            ]);

            // for ($i=0; $i < count($students); $i++) { 
            //     GroupDetails ::create([
            //         "group_id" => $request->id,
            //         "student_id" => $students[$i]["value"],
                    
            //     ]);
            // }

            // foreach($request->faculty as $value) {
            //     if($value!=$thesis->faculty_id){
            //         DefensePanelFaculty::create([
            //             "faculty_id" => $value,
            //             "defense_panel_id" => $panel->id,
            //         ]);
            //     }
            // }
            DB::commit();
            return response()->json(['result' => true, 'message' => "updated!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function rating(Request $request)
    {
        $rating = ConceptPaperRating::where('faculty_panel_id',$request->facultyPanelID)->where('defense_thesis_details_id',$request->defenseThesisDetailsID)->get();
        $defense_details=DefenseThesisDetails::where('id',$request->defenseThesisDetailsID)->first();
        $thesis=Thesis::select('id')->where('id', $defense_details->thesis_id)->first();
        $total_rating=0;
        foreach($rating as $k){
            $total_rating=$k->research_topic + $k->relevant_literature + $k->issues_gap + $k->possibe_solutions + $k->overall_concept ;
        }
        $return = array(
            'rating'     => $rating,
            'total_rating'     => $total_rating,
            'thesis'     => $thesis,
        );
        return response()->json($return, 200);
    }

    public function ratingThesisSched(Request $request)
    {
        $rating = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseSchedID)->get();
        $total_panel = DefenseShedule::select('defense_sched.*', 'defense_thesis_details.id AS defense_thesis_details_ID')
            ->join('defense_thesis_details', 'defense_sched.id', '=', 'defense_thesis_details.defense_sched_id')
            ->join('defense_panel', 'defense_thesis_details.id', '=', 'defense_panel.defense_sched_details_id')
            ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
            ->where('defense_sched.id', $request->defenseSchedID)
            ->get();
        $research_topic = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $request->defenseSchedID)->sum('research_topic');
        $relevant_literature = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $request->defenseSchedID)->sum('relevant_literature');
        $issues_gap = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $request->defenseSchedID)->sum('issues_gap');
        $possibe_solutions = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $request->defenseSchedID)->sum('possibe_solutions');
        $overall_concept = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $request->defenseSchedID)->sum('overall_concept');
        $rating_sum = $research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;

        $return = array(
            'rating_sum'     => $rating_sum,
            'total_panel_has_rating'   => sizeOf($rating),
            'total_panel'               => sizeOf($total_panel),
        );
        return response()->json($return, 200);
    }

    public function storeConceptPaperRating(Request $request)
    {
        DB::beginTransaction();
        $total = $request->issues_gap + $request->overall_concept + $request->possibe_solutions + $request->relevant_literature + $request->research_topic;
        try {
            $rate = new ConceptPaperRating();
            $rate->defense_thesis_details_id = $request->defenseThesisDetailsID;
            $rate->faculty_panel_id = $request->facultyPanelID;
            $rate->issues_gap = $request->issues_gap;
            $rate->overall_concept = $request->overall_concept;
            $rate->possibe_solutions = $request->possibe_solutions;
            $rate->relevant_literature = $request->relevant_literature;
            $rate->research_topic = $request->research_topic;
            $rate->recommendation = $request->recommendation;
            $rate->total = $total;
            $rate->thesis_id = $request->thesis_id;
            $rate->save();
            DB::commit();
            $rating = ConceptPaperRating::where('thesis_id',$request->thesis_id)->get();
            // $total_panel = DefenseShedule::select('defense_sched.*','defense_thesis_details.id AS defense_thesis_details_ID') 
            // ->join('defense_thesis_details', 'defense_sched.id', '=', 'defense_thesis_details.defense_sched_id')
            // ->join('defense_panel', 'defense_thesis_details.id', '=', 'defense_panel.defense_sched_details_id')
            // ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
            // ->where('defense_sched_id',$request->defenseSchedID)
            // ->get();
            $total_panel = DefensePanel::select('defense_panel.*') 
            // ->join('defense_thesis_details', 'defense_sched.id', '=', 'defense_thesis_details.defense_sched_id')
            // ->join('defense_panel', 'defense_thesis_details.id', '=', 'defense_panel.defense_sched_details_id')
            ->join('defense_panel_faculty', 'defense_panel_id', '=', 'defense_panel.id')
            ->where('defense_sched_details_id',$request->defenseThesisDetailsID)
            ->get();
            $research_topic= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('thesis_id',$request->thesis_id)->sum('research_topic');
            $relevant_literature= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('thesis_id',$request->thesis_id)->sum('relevant_literature');
            $issues_gap= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('thesis_id',$request->thesis_id)->sum('issues_gap');
            $possibe_solutions= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('thesis_id',$request->thesis_id)->sum('possibe_solutions');
            $overall_concept= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('thesis_id',$request->thesis_id)->sum('overall_concept');
            $rating_sum=$research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;
            $average= $rating_sum/sizeOf($total_panel);
            $thesis= Thesis::where('id', $request->thesis_id)->first();
            $rating = ConceptPaperRating::where('defense_thesis_details_id',$request->defenseSchedID)->get();
            $research_topic= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$request->defenseThesisDetailsID)->sum('research_topic');
            $relevant_literature= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$request->defenseThesisDetailsID)->sum('relevant_literature');
            $issues_gap= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$request->defenseThesisDetailsID)->sum('issues_gap');
            $possibe_solutions= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$request->defenseThesisDetailsID)->sum('possibe_solutions');
            $overall_concept= ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id',$request->defenseThesisDetailsID)->sum('overall_concept');
            $rating_sum=$research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;
            
            if($thesis->stage_id==3){
                if(sizeOf($rating)== sizeOf($total_panel)){
                    if($rating_sum>=75){
                        Thesis::where('id', $request->thesis_id)
                            ->update([
                            'status' => 'completed',
                        ]);
                    }
                }
            }
            if($thesis->stage_id==1  || $thesis->stage_id==2){
                if($average>=75){
                    Thesis::where('id', $request->thesis_id)
                    ->update([
                        'stage_id' => $thesis->stage_id+1,
                    ]);
                }
            }
            Thesislogs::create([
                "thesis_id" =>   $request->thesis_id,
                "log" =>  "Panel added rating",
            ]);
            return response()->json(['result' => true, 'message' => "Saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function saveScreenRecord(Request $request)
    {
        try {
            $file = $request->file;
           // $file_name =  $file->getClientOriginalName();
            $file_name =  "screen-record-" . rand() . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/screen-record'), $file_name);
            return $file_name;
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function notifications(Request $request)
    {return 2;
        $user = auth('api')->user();
        $recipient = Faculties::where('user_id', $user->id)->first();
        $notifications = Notifications::where('user_id',$recipient->id)->first();
        $return = array(
            'notifications'         => $notifications,
        );
        return response()->json($return, 200);
    }
}

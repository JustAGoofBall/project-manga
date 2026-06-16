<?php

namespace App\Http\Controllers;

use App\Models\linkedMaterial;
use App\Models\MainList;
use App\Models\Material;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function index()
    {
        return 'this is the index controller';
    }

    public function MainLists()
    {
        $listsModel = new MainList;
        $lists = $listsModel->fetchLists();

        return $lists; // returns all lists to ensure I'm capable of fetching information and sending it back
    }

    public function createList(Request $request)
    {
        $listsModel = new MainList;
        $gen = $listsModel->createList();

        dd($request->user());
    }

    public function input_test(Request $request)
    {

        $model = new MainList;
        $user = $request->user();

        $values = ['id' => $user->id, 'content' => $request->content];

        $model->input_test($values);
        // return ["user id" => $user->id];

    }

    public function addList(Request $request)
    {
        $model = new MainList;
        $user = $request->user();

        $values = ['List_name' => $request->List_name, 'List_type' => $request->List_type, 'List_color' => $request->List_color]; // using similar naming to avoid confusion

        if ($model->addList($values, $user) == true) {
            return "List named $values[List_name] type $values[List_type] added succesfully";
        } else {
            return 'An error has occured';
        }
    }

    //ai imrpoved version:
    public function deleteList(Request $request)
    {

        $deleted = MainList::where('id', $request->List_id)
            ->where('List_owner', $request->user()->id)
            ->delete();
        if ($deleted) {
            return response()->json([
                'message' => 'List deleted'
            ]);
        }

        return response()->json([
            'message' => 'List not found or not owned by user'
        ], 403);
    }


    // used to assign a material to a list
    public function assignMaterial(Request $request)
    {
        $user = $request->user();
        $values = ['user_id' => $user->id, 'material_id' => $request->Material_id, 'list_id' => $request->list_id, 'material_quantity' => $request->material_quantity];

        // following code checks wether the list and meterial are owned by the user
        $materialModel = new Material;

        $materialCheck = $materialModel->materialCheck($values);

        $listModel = new MainList;

        $listCheck = $listModel->listCheck($values);

        // this code actually adds it if both the material and list is owned by the same person. This is so you cannot modify someone else's list by reverse-engineering the code and using the API incorectly

        if ($materialCheck && $listCheck == true) {
            $model = new linkedMaterial();
            $model->linkMaterialToList($values);

            return 'Material succesfully linked to the list';
        } else {
            return 'The given lists and Material do not match, please re-submit';
        }
    }

    public function removeMaterialFromList(Request $request)
    {
        $user = $request->user();
        $values = ['user_id' => $user->id, 'id' => $request->id,];

        // following code checks wether the list and meterial are owned by the user
        $AssignedMaterialModel = new linkedMaterial();

        $materialCheck = $AssignedMaterialModel->AssignedMaterialCheck($values); //checks whether the assignedmaterial is owned by the user



        // this code actually adds it if both the material and list is owned by the same person. This is so you cannot modify someone else's list by reverse-engineering the code and using the API incorectly

        if ($materialCheck == true) {
            $model = new linkedMaterial();
            $deleteAssignedMaterial = $model->DeleteAssignedMaterial($values);

            return response()->json([
                'response' => 'The assigned material has been deleted'
            ]);
        } else {
            return 'Either you do not own this assigned material or this assigned material does not exist.';
        }
    }


    public function fetchAssignedMaterialList(Request $request)
    {
        $user_id = $request->user()->id;
        $model = new linkedMaterial();
        $list = $model->fetchAssignedMaterialList($user_id);

        return $list;
    }

    // used to fetch all owned lists
    public function fetchLists(Request $request)
    {

        $model = new MainList;

        $user = $request->user();
        $lists = $model->ownedLists($user->id);

        return $lists;
    }


    public function changeAssignedMaterial(Request $request)
    {
        $user = $request->user()->id;
        $item_id = $request->id;
        $item_quantity = $request->quantity;

        $values = ['user_id' => $user, 'id' => $item_id, 'item_quantity' => $item_quantity];


        $model = new linkedMaterial();

        $materialCheck = $model->AssignedMaterialCheck($values);

        $values['item_id'] = $values['id'];
        unset($values['id']);


        if ($materialCheck == true) {

            $isChanged = $model->ChangeAssignedMaterial($values);
            return $isChanged;
        } else if ($materialCheck == false) {
            return response()->json([
                'response' => 'The assigned material does not exist or is not owned by you'
            ]);
        } else {
            return response()->json([
                'response' => 'An error has occured.'
            ]);
        }
    }
}
function changeNote(Request $request)
{
    $user = $request->user();
    $user_id = $user->id;

    $note_id = $request->note_id;
    $new_header = $request->note_header;
    $new_content = $request->note_content;

    $model = new Note();

    $result = $model->changeNote(
        $user_id,
        $note_id,
        $new_header,
        $new_content
    );

    if ($result) {
        return response()->json([
            'message' => 'Note updated successfully'
        ]);
    }

    return response()->json([
        'message' => 'Unable to update note'
    ], 403);
}

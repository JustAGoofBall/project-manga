class BookController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());

        return $user->books()->withPivot([
        'current_page', 'finished', 'rating', 'review'
        ])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'total_pages' => 'required|integer',
        ]);

        return Book::create($request->all());
    }

    public function addToList($bookId)
    {
        $user = User::find(Auth::id());
        $user->books()->attach($bookId);
        return response()->json(['message' => 'Book added to list']);
    }

    public function updateProgress(Request $request, $bookId)
    {
          $request->validate([
        'current_page' => 'required|integer|min:0',
        ]);

        $userBook = UserBook::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'book_id' => $bookId
            ],
            [
                'current_page' => $request->current_page
            ]
        );

        return $userBook;
    }

    public function review(Request $request, $bookId)
    {
        $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'review' => 'nullable|string',
        ]);

        $userBook = UserBook::where('user_id', Auth::id())
            ->where('book_id', $bookId)
            ->first();

        if (!$userBook) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $userBook->update([
            'rating' => $request->rating,
            'review' => $request->review
        ]);

        return $userBook;
    }

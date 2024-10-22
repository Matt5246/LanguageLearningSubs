import BookCard from "./BookCard"

export default function Home() {
    const books = [
        {
            title: "The kleine hexe",
            author: "Otfried Preußler",
            description: "The story of a young witch who wants to be accepted by others despite being different.",
            imageUrl: "https://i0.wp.com/enterenchanted.com/wp-content/uploads/2021/07/KleineHexeAbraxas.jpg?fit=474%2C667&ssl=1",
        },
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            description: "A gripping portrayal of racial injustice and human morality",
            imageUrl: "https://images-na.ssl-images-amazon.com/images/I/91kMn3fG5WL.jpg",
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            description: "A novel about the American Dream, wealth, and the pursuit of happiness",
            imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81CzUemh9SL.jpg",
        },
        {
            title: "1984",
            author: "George Orwell",
            description: "A dystopian novel depicting a totalitarian regime and the power of propaganda",
            imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81VXJZPfNRL.jpg",
        },
        {
            title: "Pride and Prejudice",
            author: "Jane Austen",
            description: "A classic romantic novel exploring themes of love, social class, and personal growth",
            imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51qNHnR1JyL.jpg",
        },
    ];
    return (
        <div className="flex m-6 ">
            {
                books.map((book, index) => <BookCard key={index} {...book} />)
            }
        </div>
    );
}

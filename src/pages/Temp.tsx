import AuthContext from "context/AuthContext"
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore"
import { db } from "firebaseApp"
import { useContext } from "react"

export default function TempPost() {
    const { user } = useContext(AuthContext)

    const handlepost = async () => {
        const confirm = window.confirm('100 post go?')
        if(!confirm) return

        const postRef = collection(db, 'posts')

        for(let i = 101; i < 201; i++) {
            await addDoc(postRef, {
                uid : user?.uid,
                displayName : user?.displayName,
                email : `더미`,
                content : `더미 포스트 num-${i}`,
                hashTag : [`더미`, `더미-${i}`],
                createdAt : new Date().toLocaleDateString("ko", {
                    hour : '2-digit',
                    minute : '2-digit',
                    second : '2-digit'
                }), 
                likes : [ user?.uid ],
                likeCount : 1,
            })
        }
    }

    const handleDeletePost = async () => {
        const confirm = window.confirm('all post delete?')
        if(!confirm) return

        const postRef = collection(db, 'posts')
        const postQuery = query(postRef, where('email', '==', '더미'))
        const posts = await getDocs(postQuery)
        const batch = writeBatch(db)

        posts.forEach((item) => {
            batch.delete(item?.ref)
        })

        await batch.commit()
        alert('posts delete finish')
    }

    const handleDeletePost2 = async () => {
        const confirm = window.confirm('119 post delete?')
        if (!confirm) return;
    
        const postRef = collection(db, 'posts');
        const batch = writeBatch(db);
    
        // 101부터 200까지 각각의 문서에 대해 쿼리를 수행
        for (let i = 81; i <= 200; i++) {
            const postQuery = query(postRef, where('hashTag', 'array-contains', `더미-${i}`));
            const posts = await getDocs(postQuery);
    
            posts.forEach((item) => {
                batch.delete(item.ref);
            });
        }
    
        await batch.commit();
        alert('posts delete finish');
    }

    const handleFollow = async () => {
        const confirm = window.confirm('200 followo go?')
        if(!confirm) return
        if(!user?.uid) return

        const followingRef = doc(db, 'following', user?.uid)
        const followerRef = doc(db, 'follower', user?.uid)

        for(let i = 0; i < 200; i++) {
            await setDoc(followingRef, {
                users : arrayUnion({ uid : `temp-${i}`, temp : true })
            }, { merge : true })

            await setDoc(followerRef, {
                users : arrayUnion({ uid : `temp-${i}`, temp : true })
            }, { merge : true })
        }

        alert('follow finished')
    }

    const handleDeleteFollow = async () => {
        const confirm = window.confirm('200 follow Delete go?')
        if(!confirm) return
        if(!user?.uid) return

        const followingRef = doc(db, 'following', user?.uid)
        const followerRef = doc(db, 'follower', user?.uid)
        const batch = writeBatch(db)

        for(let i = 0; i < 200; i++) {
            batch.update(followingRef, {
                users : arrayRemove({ uid : `temp-${i}`, temp : true })
            });
            batch.update(followerRef, {
                users : arrayRemove({ uid : `temp-${i}`, temp : true })
            })
        }

        await batch.commit()
        alert('follow delete finished')
    }

    return (
        <div className="font-bold p-5 border-5">
            <button onClick={ handleDeletePost2 } className="p-5 border-black border-5 z-50">
                delete 120 post
            </button>
            {/* <button onClick={ handlepost }>create post</button>
            <button onClick={ handleFollow }>follow</button> */}
        </div>
    )
}
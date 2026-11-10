import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

// LOCAL STORAGE FALLBACK FOR GUEST / OFFLINE
const GUEST_CHATS_KEY = "uin_guest_chats";
const GUEST_MESSAGES_KEY_PREFIX = "uin_guest_msgs_";

function getGuestChats() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CHATS_KEY) || "[]");
  } catch (_) {
    return [];
  }
}

function saveGuestChats(chats) {
  localStorage.setItem(GUEST_CHATS_KEY, JSON.stringify(chats));
}

// ------------------- CHAT SESSIONS -------------------

export async function getUserChats(userId) {
  if (!userId || !isFirebaseConfigured || !db) {
    return getGuestChats();
  }

  try {
    const q = query(
      collection(db, "chats"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      updatedAt: d.data().updatedAt?.toDate ? d.data().updatedAt.toDate().toISOString() : new Date().toISOString()
    }));
  } catch (err) {
    console.warn("Firestore fetch error, fallback to guest:", err);
    return getGuestChats();
  }
}

export async function createNewChatSession(userId, initialTitle = "Percakapan Baru", faculty = "Semua Fakultas", mode = "simple") {
  const chatId = "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
  const now = new Date().toISOString();

  if (!userId || !isFirebaseConfigured || !db) {
    const guestChats = getGuestChats();
    const newChat = { id: chatId, title: initialTitle, faculty, mode, updatedAt: now, createdAt: now };
    saveGuestChats([newChat, ...guestChats]);
    return newChat;
  }

  try {
    const ref = doc(db, "chats", chatId);
    const chatData = {
      userId,
      title: initialTitle,
      faculty,
      mode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(ref, chatData);
    return { id: chatId, ...chatData, updatedAt: now };
  } catch (err) {
    console.error("Error creating chat in Firestore:", err);
    return { id: chatId, title: initialTitle, faculty, mode, updatedAt: now };
  }
}

export async function updateChatSessionTitle(chatId, newTitle, userId) {
  if (!userId || !isFirebaseConfigured || !db) {
    const chats = getGuestChats().map(c => c.id === chatId ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c);
    saveGuestChats(chats);
    return;
  }
  try {
    await updateDoc(doc(db, "chats", chatId), {
      title: newTitle,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Failed to update chat title:", err);
  }
}

export async function deleteChatSession(chatId, userId) {
  if (!userId || !isFirebaseConfigured || !db) {
    const chats = getGuestChats().filter(c => c.id !== chatId);
    saveGuestChats(chats);
    localStorage.removeItem(GUEST_MESSAGES_KEY_PREFIX + chatId);
    return;
  }
  try {
    await deleteDoc(doc(db, "chats", chatId));
  } catch (err) {
    console.error("Failed to delete chat session:", err);
  }
}

// ------------------- MESSAGES -------------------

export async function getSessionMessages(chatId, userId) {
  if (!chatId) return [];

  if (!userId || !isFirebaseConfigured || !db) {
    try {
      return JSON.parse(localStorage.getItem(GUEST_MESSAGES_KEY_PREFIX + chatId) || "[]");
    } catch (_) {
      return [];
    }
  }

  try {
    const ref = doc(db, "chats", chatId, "data", "messages");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().list || [];
    }
    return [];
  } catch (err) {
    console.warn("Failed to fetch messages from Firestore, checking localStorage:", err);
    return JSON.parse(localStorage.getItem(GUEST_MESSAGES_KEY_PREFIX + chatId) || "[]");
  }
}

export async function saveSessionMessages(chatId, messages, userId) {
  if (!chatId) return;

  // Always keep copy in localStorage for speed
  try {
    localStorage.setItem(GUEST_MESSAGES_KEY_PREFIX + chatId, JSON.stringify(messages));
  } catch (_) {}

  if (!userId || !isFirebaseConfigured || !db) return;

  try {
    const ref = doc(db, "chats", chatId, "data", "messages");
    await setDoc(ref, { list: messages, updatedAt: serverTimestamp() }, { merge: true });

    // Touch chat updatedAt
    await updateDoc(doc(db, "chats", chatId), {
      updatedAt: serverTimestamp()
    }).catch(() => {});
  } catch (err) {
    console.error("Failed to save messages to Firestore:", err);
  }
}


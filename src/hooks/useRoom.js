/* eslint-disable no-console */
import {
	collection, setDoc, doc, getDoc, onSnapshot, addDoc, updateDoc, deleteDoc,
} from "firebase/firestore"
import { db } from "../services/firebase"
import { nanoid } from "nanoid"
import { useVideoStreamContext } from "../context/videoStream"
import { stunServerconfiguration } from "../constants"
import { registerPeerConnectionListeners } from "../utils/rtc"

export const useRoom = () => {
	const {
		roomId,
		setRoomId,
		localStream,
		remoteStream,
		peerConnection,
	} = useVideoStreamContext()

	const createRoom = async () => {
		const roomRef = doc(db, "rooms", roomId || nanoid(6))
		await setDoc(roomRef, {})
		console.log("Create PeerConnection with configuration: ", stunServerconfiguration)
		peerConnection.current = new RTCPeerConnection(stunServerconfiguration)

		registerPeerConnectionListeners(peerConnection)

		localStream?.getTracks().forEach((track) => {
			peerConnection.current.addTrack(track, localStream)
		})

		// Code for collecting ICE candidates
		const callerCandidatesCollection = collection(roomRef, "callerCandidates")

		peerConnection.current.addEventListener("icecandidate", async (event) => {
			if (!event.candidate) {
				console.log("Got final candidate!")
				return
			}
			console.log("Got candidate: ", event.candidate)
			addDoc(callerCandidatesCollection, event.candidate.toJSON(), { merge: false })
		})
		// Code for collecting ICE candidates above

		// Code for creating a room below
		const offer = await peerConnection.current.createOffer()
		peerConnection.current.setLocalDescription(offer)

		const roomWithOffer = {
			offer: {
				type: offer.type,
				sdp: offer.sdp,
			},
		}
		await setDoc(roomRef, roomWithOffer, { merge: true })

		setRoomId(roomRef.id)

		console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`)

		peerConnection.current.addEventListener("track", (event) => {
			console.log("Got remote track:", event.streams[0])
			event.streams[0].getTracks().forEach((track) => {
				console.log("Add a track to the remoteStream:", track)
				remoteStream.addTrack(track)
			})
		})

		// Listening for remote session description below

		onSnapshot(roomRef, async (snapshot) => {
			const data = snapshot.data()
			if (!peerConnection.current.currentRemoteDescription && data && data.answer) {
				console.log("Got remote description: ", data.answer)
				const rtcSessionDescription = new RTCSessionDescription(data.answer)
				await peerConnection.current.setRemoteDescription(rtcSessionDescription)
			}
		})
		// Listening for remote session description above

		// Listen for remote ICE candidates below
		onSnapshot(callerCandidatesCollection, (snapshot) => {
			snapshot.docChanges().forEach(async (change) => {
				if (change.type === "added") {
					const data = change.doc.data()
					console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
					await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
				}
			})
		})

		// Listen for remote ICE candidates above
	}

	const closeRoom = async () => {
		localStream?.getTracks()?.forEach((track) => {
			track.enabled = false
			track.stop()
		})

		if (remoteStream) {
			remoteStream.getTracks().forEach((track) => track.stop())
		}

		if (peerConnection) {
			peerConnection.current.close()
		}

		// Delete room on hangup
		if (roomId) {
			const roomRef = await doc(db.collection("rooms"), roomId)

			deleteDoc(roomRef)
		}
		window.location.reload()
	}

	const joinRoomById = async () => {
		const roomRef = doc(db, "rooms", roomId)

		const roomSnapshot = await getDoc(roomRef)

		console.log("Got room:", roomSnapshot.exists())

		if (roomSnapshot.exists()) {
			console.log("Create PeerConnection with configuration: ", stunServerconfiguration)
			peerConnection.current = new RTCPeerConnection(stunServerconfiguration)
			registerPeerConnectionListeners(peerConnection)
			localStream?.getTracks().forEach((track) => {
				peerConnection.current.addTrack(track, localStream)
			})

			// Code for collecting ICE candidates below
			const calleeCandidatesCollection = collection(roomRef, "calleeCandidates")
			peerConnection.current.addEventListener("icecandidate", (event) => {
				if (!event.candidate) {
					console.log("Got final candidate!")
					return
				}
				console.log("Got candidate: ", event.candidate)
				addDoc(calleeCandidatesCollection, event.candidate.toJSON())
			})

			// Code for collecting ICE candidates above

			peerConnection.current.addEventListener("track", (event) => {
				console.log("Got remote track:", event.streams[0])
				event.streams[0].getTracks().forEach((track) => {
					console.log("Add a track to the remoteStream:", track)
					remoteStream.addTrack(track)
				})
			})

			// Code for creating SDP answer below
			const { offer } = roomSnapshot.data()
			console.log("Got offer:", offer)
			await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
			const answer = await peerConnection.current.createAnswer()
			console.log("Created answer:", answer)
			await peerConnection.current.setLocalDescription(answer)

			const roomWithAnswer = {
				answer: {
					type: answer.type,
					sdp: answer.sdp,
				},
			}

			await updateDoc(roomRef, roomWithAnswer)
			// Code for creating SDP answer above

			// Listening for remote ICE candidates below
			const callerCandidatesCollection = collection(roomRef, "callerCandidates")

			onSnapshot(callerCandidatesCollection, (snapshot) => {
				snapshot.docChanges().forEach(async (change) => {
					if (change.type === "added") {
						const data = change.doc.data()
						console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
						await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
					}
				})
			})
			// Listening for remote ICE candidates above
		}
	}

	const enterRoom = () => {
		if (roomId) {
			joinRoomById()
		} else {
			createRoom()
		}
	}

	return {
		closeRoom,
		createRoom,
		joinRoomById,
		enterRoom,
		roomId,
		setRoomId,
		localStream,
		remoteStream,
	}
}

// const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
// const [modalVisibleSubArea, setModalVisibleSubArea] = useState(false);

// <Modal
// transparent={true}
// animationType="fade"
// visible={modalVisibleSubArea}
// onRequestClose={() => {
//   Alert.alert('Modal has been closed.');
//   setModalVisibleSubArea(!modalVisibleSubArea);
// }}>
// <View
//   style={{
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginTop: 22,
//   }}>
//   <TouchableWithoutFeedback
//     onPress={() => {
//       setModalVisibleSubArea(false);
//     }}>
//     <View
//       style={{
//         height: '100%',
//         width: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       }}
//     />
//   </TouchableWithoutFeedback>
//   <View
//     style={{
//       flex: 1,
//       flexDirection: 'column',
//       width: '90%',
//       position: 'absolute',
//       backgroundColor: 'white',
//       borderRadius: 5,
//       padding: 35,
//       // margin: 10,
//       // alignItems: 'center',
//       shadowColor: '#000',
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.25,
//       shadowRadius: 4,
//       elevation: 5,
//     }}>
//     <Text style={{textAlign: 'center', marginBottom: 15}}>
//       Detail {detailSubArea?.name}
//     </Text>
//     {/* buat seperti tabel gimna ada column
//     dengan nama Object, quantiy dan action
//     */}
//     <Text style={{fontSize: 16, marginBottom: 5, fontWeight: '700'}}>
//       List Object
//     </Text>

//     <FlatList
//       data={trees}
//       renderItem={({item}) => (
//         <View
//           style={{
//             paddingVertical: 1,
//             flexDirection: 'row',
//           }}>
//           <Text style={{flex: 4}}>
//             {item.tree.name} x{item.quantity}
//           </Text>
//           <Pressable
//             onPress={() => {
//               if (!isTimerRunning) {
//                 socket?.emit('cuttingTree', {treeId: item._id});
//                 setIsTimerRunning(true);
//               } else {
//                 ToastAndroid.show(
//                   'To many request',
//                   ToastAndroid.SHORT,
//                 );
//               }
//             }}
//             style={({pressed}) => [
//               {
//                 backgroundColor: pressed ? 'gray' : 'lightgray',
//               },
//               {
//                 borderRadius: 5,
//                 paddingHorizontal: 8,
//                 paddingVertical: 1,
//               },
//             ]}>
//             <Text
//               style={{
//                 flex: 1,
//                 textAlign: 'right',
//               }}>
//               Action
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     />
//     <Text
//       style={{
//         fontSize: 16,
//         marginBottom: 5,
//         marginTop: 10,
//         fontWeight: '700',
//       }}>
//       List Monster
//     </Text>
//     <FlatList
//       data={monsters}
//       renderItem={({item}) => (
//         <View
//           style={{
//             paddingVertical: 1,
//             flexDirection: 'row',
//           }}>
//           <Text style={{flex: 4}}>{item.monster.name}</Text>
//           <Pressable
//             onPress={() => {
//               if (!isTimerRunning) {
//                 socket?.emit('attackMonster', {monsterId: item._id});
//                 setIsTimerRunning(true);
//               } else {
//                 ToastAndroid.show(
//                   'To many request',
//                   ToastAndroid.SHORT,
//                 );
//               }
//             }}
//             style={({pressed}) => [
//               {
//                 backgroundColor: pressed ? 'gray' : 'lightgray',
//               },
//               {
//                 borderRadius: 5,
//                 paddingHorizontal: 8,
//                 paddingVertical: 1,
//               },
//             ]}>
//             <Text
//               style={{
//                 flex: 1,
//                 textAlign: 'right',
//               }}>
//               Action
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     />
//     {/* <Text>{detailSubArea?.trees[0].quantity}</Text> */}
//     <Pressable
//       style={{
//         marginTop: 15,
//         borderRadius: 5,
//         padding: 10,
//         elevation: 2,
//         backgroundColor: '#2196F3',
//       }}
//       onPress={() => setModalVisibleSubArea(!modalVisibleSubArea)}>
//       <Text
//         style={{
//           color: 'white',
//           fontWeight: 'bold',
//           textAlign: 'center',
//         }}>
//         Close
//       </Text>
//     </Pressable>
//     {isTimerRunning && (
//       <Timer
//         duration={5}
//         onTimerComplete={() => {
//           setIsTimerRunning(false);
//         }}
//       />
//     )}
//   </View>
// </View>
// </Modal>

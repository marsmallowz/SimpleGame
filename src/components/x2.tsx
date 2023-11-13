<View>
<View
  style={{
    // saat di hide ubah shrink dan grow: 0 dan basis auto
    // flexShrink: 1,
    // flexBasis: 100,
    // flexGrow: 1,
    flex: 2,
    gap: 8,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  }}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    }}>
    <Text
      style={{
        fontSize: 16,
        fontWeight: '700',
      }}>
      List Monster
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontWeight: '700',
        color: 'gray',
      }}>
      Hide
    </Text>
  </View>

  <FlatList
    style={{
      paddingHorizontal: 15,
    }}
    data={monsters}
    renderItem={({item}) => (
      <>
        <View
          style={{
            padding: 5,
            borderRadius: 5,
            marginVertical: 5,
            backgroundColor: 'gray',
            flexDirection: 'row',
          }}>
          <Text style={{flex: 4, color: 'white'}}>
            {item.monster.name}
          </Text>
          <Pressable
            onPress={() => {
              if (!isTimerRunning) {
                socket?.emit('attackMonster', {monsterId: item._id});
                setIsTimerRunning(true);
              } else {
                ToastAndroid.show(
                  'To many request',
                  ToastAndroid.SHORT,
                );
              }
            }}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? 'gray' : 'white',
              },
              {
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 1,
              },
            ]}>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
              }}>
              Action
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            padding: 5,
            borderRadius: 5,
            marginVertical: 5,
            backgroundColor: 'gray',
            flexDirection: 'row',
          }}>
          <Text style={{flex: 4, color: 'white'}}>
            {item.monster.name}
          </Text>
          <Pressable
            onPress={() => {
              if (!isTimerRunning) {
                socket?.emit('attackMonster', {monsterId: item._id});
                setIsTimerRunning(true);
              } else {
                ToastAndroid.show(
                  'To many request',
                  ToastAndroid.SHORT,
                );
              }
            }}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? 'gray' : 'white',
              },
              {
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 1,
              },
            ]}>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
              }}>
              Action
            </Text>
          </Pressable>
        </View>
      </>
    )}
  />
</View>
<View
  style={{
    flex: 2,
    gap: 8,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  }}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    }}>
    <Text
      style={{
        fontSize: 16,
        fontWeight: '700',
      }}>
      List Monster
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontWeight: '700',
        color: 'gray',
      }}>
      Hide
    </Text>
  </View>
  <FlatList
    style={{
      paddingHorizontal: 15,
    }}
    data={trees}
    renderItem={({item}) => (
      <View
        style={{
          padding: 5,
          borderRadius: 5,
          marginVertical: 5,
          backgroundColor: 'gray',
          flexDirection: 'row',
        }}>
        <Text style={{flex: 4, color: 'white'}}>
          {item.tree.name} x{item.quantity}
        </Text>
        <Pressable
          onPress={() => {
            if (!isTimerRunning) {
              socket?.emit('cuttingTree', {treeId: item._id});
              setIsTimerRunning(true);
            } else {
              ToastAndroid.show(
                'To many request',
                ToastAndroid.SHORT,
              );
            }
          }}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? 'gray' : 'white',
            },
            {
              borderRadius: 5,
              paddingHorizontal: 8,
              paddingVertical: 1,
            },
          ]}>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            Action
          </Text>
        </Pressable>
      </View>
    )}
  />
</View>
<View
  style={{
    flex: 1,
    gap: 8,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  }}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    }}>
    <Text
      style={{
        fontSize: 16,
        fontWeight: '700',
      }}>
      List NPC
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontWeight: '700',
        color: 'gray',
      }}>
      Hide
    </Text>
  </View>
  {/* <FlatList
  data={logs.attackMonster}
  renderItem={({item}) => <Text>{item}</Text>}
/> */}
</View>
<View
  style={{
    flex: 1,

    gap: 8,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  }}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    }}>
    <Text
      style={{
        fontSize: 16,
        fontWeight: '700',
      }}>
      List Portal
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontWeight: '700',
        color: 'gray',
      }}>
      Hide
    </Text>
  </View>
</View>
</View>
<View
style={{
  flex: 1,
  gap: 8,
  paddingVertical: 15,
  borderRadius: 5,
  backgroundColor: 'white',
}}>
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  }}>
  <Text
    style={{
      fontSize: 16,
      fontWeight: '700',
    }}>
    Logs
  </Text>
  <Text
    style={{
      fontSize: 14,
      fontWeight: '700',
      color: 'gray',
    }}>
    Hide
  </Text>
</View>
<FlatList
  data={logs.attackMonster}
  renderItem={({item}) => <Text>{item}</Text>}
/>
</View>
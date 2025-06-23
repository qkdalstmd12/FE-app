import { findUserEmail } from '@/api/user/membership';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function LoginPage() {
    const [nickName,setNickName] = useState<string>("");
    const [runningType,setRunningType] = useState<string>("");
    const [email,setEmail] = useState<string>("");
    const [error,setError] = useState<boolean>(false);

    const findId = async(e: any) => {
        e.preventDefult();
        try {
        const response = await findUserEmail(nickName,runningType);
        setEmail(response)

        router.push('/')
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <View style={styles.overlay}>
        <View style={styles.formContainer}>
            <View style={styles.formHeader}>
                <TouchableOpacity onPress={()=>router.back()}><Text style={styles.headerText}>{"<"}</Text></TouchableOpacity>
                    <Text style={styles.headerText}>Runnify로 로그인</Text>
            </View>
            <View style={styles.formContent}>
            <View style={styles.formLabel}>
                <Text style={styles.inputLabelText}>닉네임</Text>
            <TextInput
            style={styles.formInput}
            placeholder="닉네임을 입력하세요"
            value={nickName}
            onChangeText={setNickName}
            />
            </View>
            <View style={styles.formLabel}>
                <Text style={styles.inputLabelText}>러닝 타입</Text>
            <TextInput
            style={styles.formInput}
            placeholder="여기에 입력하세요"
            value={runningType}
            onChangeText={setRunningType}
            />
            </View>
            <View style={styles.formAlter}>
            <TouchableOpacity onPress={()=>router.push("/user/membership")}>
            <Text>회원가입</Text>
            </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.push("/user/findId")}>
        <Text>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.push("/user/findPassword")}>
        <Text>비밀번호 찾기</Text>
        </TouchableOpacity>
            </View>
            <Text>email:{email}</Text>
            <View>
                <TouchableOpacity style={styles.formButton} onPress={findId}><Text style={styles.formButtonText}>로그인하기</Text></TouchableOpacity>
            </View>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    overlay : {
        backgroundColor: 'rgba(0,0,0,0.2)',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    formContainer : {
        borderRadius:21,
        width:'90%',
        flexDirection: 'column',
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        padding:30,
        gap:30,
    },
    formHeader: {
        flexDirection:'row',
        width:'100%',
        gap:30,
    },
    headerText:{
        fontSize:24,
    },
    formContent:{
        flexDirection:"column",
        paddingHorizontal:20,
        gap:30,
        width:'100%'
    },
    inputLabelText:{
        fontSize:13,
        marginHorizontal:5,
    },
    formLabel:{
        flexDirection:'column',
        gap:10
    },
    formInput:{
        height:50,
        borderRadius:6,
        borderWidth:1,
        padding:10,
    },
    formAlter:{
        flexDirection:'row',
        gap:2,
    },
    formButton:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6,
        backgroundColor:"#414B61",
        padding:20,
        color:'white',
    },
    formButtonText:{
        color:'white'
    }
})
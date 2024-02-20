"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Writing.module.css";
import { FaAngleDown, FaCaretDown, FaImage, FaPlus, FaRegFaceSmile, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoBackHeader } from "../Header/Top/TopHeader";

export default function Writing({data}) {

    const router = useRouter();

    const [topic, setTopic] = useState(data ? data.topic : "")
 
    const [postBtn, setPostBtn] = useState(true);
    const title = useRef();
    const content = useRef();
    const [livechat, setLivechat] = useState(data?data.livechat : false);

    useEffect(() => {
        title.current.value = data?data.title:"";
        content.current.value = data?data.content: "";        
    }, [])


    const onWritingHandler = (event) => {
        event.target.style.height = "auto";
        postBtnDisabledHandler()
    }
    const livechatHandler = (event) => {
        setLivechat(event.target.checked)
    }
    const postBtnDisabledHandler = () => {
        const newTitle = title.current.value.replaceAll(/(\n|\r\n)/g, "");
        const newContent = content.current.value.replaceAll(/(\n|\r\n)/g, "");
        if(newTitle && newContent && topic) {
            setPostBtn(false);
        } else if(!newTitle && !newContent && !topic) {
            setPostBtn(true);
        } else {
            setPostBtn(true);
        }
    }

    // Topic SelectBox 
    const selectBox = useRef();
    const optionList = useRef();

    const [active, setActive] = useState(false);

    const openOptionList = () => {
        setActive(active ? false : true);
    }
    const selectOption = (event) => {
        setTopic(event.target.value);
        openOptionList()
    }

    useEffect(() => {
        const postBtnDisabledHandler = () => {
            const newTitle = title.current.value.replaceAll(/(\n|\r\n)/g, "");
            const newContent = content.current.value.replaceAll(/(\n|\r\n)/g, "");
            if(newTitle && newContent && topic) {
                setPostBtn(false);
            } else if(!newTitle && !newContent && !topic) {
                setPostBtn(true);
            } else {
                setPostBtn(true);
            }
        }
        postBtnDisabledHandler()
    }, [topic]);


    // Tag 기능
    const [tags, setTags] = useState(data ? data.hashtag : []);
    const tagState = useRef()

    const tagHandler = (event) => {
        const blank_pattern = /[\s]/g;
        if(blank_pattern.test(event.target.value)) {
            tagState.current.value = event.target.value.replace(/ /g,"");
            if(tagState.current.value) {
                if(!tags.includes(tagState.current.value)) {
                    addTagHandler()
                } else if(tags.includes(tagState.current.value)) {
                    alert("태그가 이미 존재합니다");
                    tagState.current.value = "";
                }
            }
        }
    }
    const tagKeyPressHandler = (event) => {
        if (tagState.current.value && event.keyCode === 13) {
            if(tags.includes(tagState.current.value)) {
                alert("태그가 이미 존재합니다");
                tagState.current.value = "";
            } else {
                addTagHandler();
            }
        } else if(!tagState.current.value && event.keyCode === 8) {
            const removeTag = tags.pop();
            const newTags = tags.filter((tag) => tag !== removeTag);
            setTags(newTags);
        }
    };
    const addTagHandler = () => {
        setTags([...tags, tagState.current.value]);
        tagState.current.value = "";
    }
    const removeTagHandler = (event) => {
        const newTags = tags.filter((tag) => tag !== event.currentTarget.id);
        setTags(newTags);
    }


    // 카테고리 상태값
    const [scope, setScope] = useState(data?data.scope : "전체")

    const selectScope = (event) => {
        const value = event.currentTarget.value;
        setScope(value);
    }

    const [selectedImages, setSelectedImages] = useState([]);
  
    const handleImageChange = (e) => {
        const files = e.target.files;
        if(files.length > 5) {
            return
        }
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setSelectedImages([...newImages, ...selectedImages]);
    };

    const removeImageHandler = (indexToRemove) => {
        setSelectedImages((prevImages) => {
            const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
            return updatedImages;
        });
    }

    const [isloading, setIsLoading] = useState(false)
    // 게시물 업로드 
    const onSubmitHandler = async (e) => {
        setIsLoading(true)
        const uploadData = {
            topic:  topic,
            title: title.current.value,
            content : content.current.value,
            tags : tags,
            livechat : livechat,
            scope : scope,
            images : selectedImages,
        }
        setPostBtn(true)
        // const formData = new FormData();
        // for (let i = 0; i < selectedImages.length; i++) {
        //     formData.append('images', selectedImages[i]);
        // }
        // const uploadResponse = await axios.post('/api/upload/image', formData);
        // uploadData.images = uploadResponse.data.imageUrls;

        if(data) {
            axios.put(`/api/post/${data._id}`,uploadData)
            .then((res) => {
                if(res.status === 200) {
                    alert("수정되었습니다!");
                    router.replace(`/post/${data._id}`)
                }
            })

        } else {
            axios.post('/api/share', uploadData)
            .then((res) => {
                if(res.status === 200) {

                    alert("포스트가 완료되었습니다!");
                    router.replace(`/sharing/all`)
                }
            })
        }
    }

    return (

        <div className={styles.page}>       
            <GoBackHeader title={data?"수정하기" : "글쓰기"} button={<div className={styles.tipBtn}><FaRegFaceSmile size={22}/></div> } />         
            <div className={styles.form_wrapper}>
                <div className={styles.content_wrapper}>
                    <div className={styles.input_topic}>
                        <div ref={selectBox} className={`${styles.selectBox} ${(active ? styles.active : '')}`}>
                            <button onClick={openOptionList} className={`${styles.label} ${topic ? styles.selected : ""}`}>{topic ? topic : "토픽을 선택하세요"}<FaCaretDown size={20}/></button>
                            <div ref={optionList} className={styles.optionList}>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="수다"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="연애·썸"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="인간관계"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="공부·성적"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="학교생활"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="입시"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="진로"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="쇼핑·소비"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="게임"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="여가·취미"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="학원"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="스포츠"></input>
                                <input type="submit" onClick={selectOption} className={styles.optionItem} value="흑역사"></input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.input_wrapper}>
                        <textarea ref={title} onChange={onWritingHandler} className={styles.input} placeholder="제목을 입력해주세요" rows={1} id={styles.title}></textarea>
                    </div>
                    <div className={styles.input_wrapper}>
                        <textarea ref={content} onChange={onWritingHandler} className={styles.input} placeholder="내용을 입력해주세요" rows={15} id={styles.content}></textarea>
                    </div>
                    {/* <div className={styles.image_input_wrapper}>
                        <div className={`${styles.imageInputBox} ${selectedImages.length > 0 && styles.active}`}>
                            <label for="image" className={styles.imageLabel}>{selectedImages.length > 0 ? <FaPlus size={30}/> : <><FaImage  size={30}/><span>이미지를 선택해주세요</span></>}</label>
                            <input onChange={handleImageChange} type="file" id="image" name="image" accept="image/*" className={styles.imageInput} ></input>
                        </div>
                        {selectedImages.length > 0 && <div className={styles.imageList}>
                            <div className={styles.imageListWrapper}>
                                {selectedImages.map((image, i) => (
                                    <div key={i} className={styles.imageItem}>
                                        <img src={image} className={styles.preImg}></img>
                                        <div className={styles.imageItemWrapper}>
                                            <span>{selectedImages.length - i}</span>
                                            <button onClick={() => removeImageHandler(i)} className={styles.removeImgBtn}> <FaXmark size={22}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div> */}
                </div>
                <div className={styles.submit_card}>
                    <div className={styles.submit_wrapper}>
                        <div className={styles.setting}>
                            <span className={styles.settingLabel}>공개범위</span>
                            <div className={styles.settingContent}>
                                <div className={styles.slideBtnGroup}>
                                    <button onClick={selectScope} value="전체" className={`${styles.slideBtn} ${scope === "전체" ? styles.active : ''}`}>전체</button>
                                    <button onClick={selectScope} value="우리학교" className={`${styles.slideBtn} ${scope === "우리학교" ? styles.active : ''}`}>우리학교</button>
                                    <div className={`${styles.slideBg} ${scope ? scope === "전체" ? styles.cgAll : styles.cgSchool : ''}`}></div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.setting}>
                            <span className={styles.settingLabel}>태그</span>
                            <div className={styles.settingContent}>
                                <div className={styles.tagBox}>
                                    {tags?.map((e, i) => (
                                        <div key={i} id={e} onClick={removeTagHandler} className={styles.tag}><span>#{e}</span><FaXmark size={20} /></div>
                                    ))}
                                    <input ref={tagState} onChange={tagHandler} onKeyDown={tagKeyPressHandler} rows={1} className={styles.tagInput} placeholder='# 태그 입력'></input>
                                </div>
                            </div>
                        </div>
                        <div className={styles.setting}>
                            <span className={styles.settingLabel}>고급설정</span>
                            <div className={styles.settingContent}>
                                <div className={styles.settingWrapper}>
                                    <span className={styles.settingTitle}><span className={styles.settingAbout}><FaAngleDown size={20}/></span>라이브챗</span>
                                    <div className={styles.settingCheck}>
                                        <label className={styles.checkSwitch}>
                                            <input checked={livechat} onChange={livechatHandler} type="checkbox"></input>
                                            <span className={styles.checkSlider}></span>
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.settingWrapper}>
                                    <span className={styles.settingTitle}><span className={styles.settingAbout}><FaAngleDown size={20}/></span>댓글 차단</span>
                                    <div className={styles.settingCheck}>
                                        <label className={styles.checkSwitch}>
                                            <input type="checkbox"></input>
                                            <span className={styles.checkSlider}></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={onSubmitHandler} disabled={postBtn} id={styles.post} className={styles.postBtn} type="submit">업로드</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
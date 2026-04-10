import streamlit as st
import requests

st.title("AI Multi-Model Platform")

text = st.text_area("Enter text")

if st.button("Analyze"):
    res = requests.post("http://127.0.0.1:8000/text", params={"text": text})
    st.write(res.json())
option = st.selectbox("Choose", ["Text", "Image"])

if option == "Image":
    image_file = st.file_uploader("Upload image", type=["jpg", "png"])
    if image_file:
        st.image(image_file)
        res = requests.post(
            "http://127.0.0.1:8000/image",
            files={"file": image_file.getvalue()}
        )
        data = res.json()
        
        if "text_analysis" in data:
            st.subheader("Image Text Summary")
            st.info(data["text_analysis"]["summary"])
            
            col1, col2 = st.columns(2)
            col1.write(f"**Sentiment:** {data['text_analysis']['sentiment']}")
            col2.write(f"**Confidence:** {data['text_analysis']['confidence']:.2f}")
        
        with st.expander("Show Raw Metadata"):
            st.json(data)

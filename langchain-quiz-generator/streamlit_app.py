import os
from dataclasses import asdict, dataclass
from datetime import datetime

import streamlit as st

try:
    from langchain.chains import LLMChain, SequentialChain
    from langchain.prompts import PromptTemplate
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:
    LLMChain = None
    SequentialChain = None
    PromptTemplate = None
    ChatGoogleGenerativeAI = None


st.set_page_config(
    page_title="LangChain Quiz Generator",
    page_icon="Q",
    layout="wide",
)


@dataclass
class QuizResult:
    topic: str
    audience: str
    question: str
    answer: str
    source: str
    created_at: str


QUESTION_TEMPLATE = """
You are an expert educator creating beginner-friendly quiz content.

Create one beginner-level quiz question about this topic:
{topic}

Audience:
{audience}

Requirements:
- Ask exactly one question.
- Make it clear and specific.
- Do not include the answer.
- Keep it appropriate for someone new to the topic.
"""

ANSWER_TEMPLATE = """
You are an expert educator writing detailed answer keys.

Question:
{question}

Write the correct answer and a helpful explanation.

Use this format:
Answer: <the correct answer>
Explanation: <why this answer is correct, in 3-5 sentences>
Key takeaway: <one sentence the learner should remember>
"""


def get_api_key() -> str | None:
    return os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")


@st.cache_resource(show_spinner=False)
def load_llm(api_key: str, temperature: float):
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=temperature,
        convert_system_message_to_human=True,
        google_api_key=api_key,
    )


def build_quiz_chain(llm):
    question_prompt = PromptTemplate(
        input_variables=["topic", "audience"],
        template=QUESTION_TEMPLATE,
    )

    answer_prompt = PromptTemplate(
        input_variables=["question"],
        template=ANSWER_TEMPLATE,
    )

    question_chain = LLMChain(
        llm=llm,
        prompt=question_prompt,
        output_key="question",
    )

    answer_chain = LLMChain(
        llm=llm,
        prompt=answer_prompt,
        output_key="answer",
    )

    return SequentialChain(
        chains=[question_chain, answer_chain],
        input_variables=["topic", "audience"],
        output_variables=["question", "answer"],
        verbose=False,
    )


def demo_quiz(topic: str, audience: str) -> QuizResult:
    clean_topic = topic.strip() or "artificial intelligence"
    clean_audience = audience.strip() or "new learners"
    question = f"What is one beginner-friendly way to explain {clean_topic} to {clean_audience}?"
    answer = (
        "Answer: It is a concept that can be understood by breaking it into its main purpose, "
        "how it works, and where it is used.\n\n"
        "Explanation: A strong beginner answer avoids jargon and focuses on the core idea first. "
        "Then it adds a simple example so the learner can connect the concept to something familiar. "
        "This demo response is shown because no Google Gemini API key is configured.\n\n"
        "Key takeaway: Start with the core idea, then reinforce it with a practical example."
    )
    return QuizResult(
        topic=clean_topic,
        audience=clean_audience,
        question=question,
        answer=answer,
        source="Demo mode",
        created_at=datetime.now().isoformat(timespec="seconds"),
    )


def generate_quiz(topic: str, audience: str, temperature: float) -> QuizResult:
    api_key = get_api_key()

    if not api_key or not all([LLMChain, SequentialChain, PromptTemplate, ChatGoogleGenerativeAI]):
        return demo_quiz(topic, audience)

    llm = load_llm(api_key, temperature)
    quiz_chain = build_quiz_chain(llm)
    result = quiz_chain.invoke({"topic": topic, "audience": audience})

    return QuizResult(
        topic=topic,
        audience=audience,
        question=result["question"],
        answer=result["answer"],
        source="Gemini 2.0 Flash via LangChain SequentialChain",
        created_at=datetime.now().isoformat(timespec="seconds"),
    )


if "history" not in st.session_state:
    st.session_state.history = []


st.title("LangChain Quiz Generator")
st.caption("Sequential chains for educational question generation and answer-key creation.")

with st.sidebar:
    st.header("Chain Architecture")
    st.write("Topic input")
    st.write("Question LLMChain")
    st.write("Answer LLMChain")
    st.write("SequentialChain output")
    temperature = st.slider("Creativity", min_value=0.0, max_value=1.0, value=0.7, step=0.1)

    if get_api_key():
        st.success("Google API key detected")
    else:
        st.warning("Demo mode: set GOOGLE_API_KEY to use Gemini")


tab_generate, tab_history, tab_design = st.tabs(["Generate", "History", "Chain Design"])

with tab_generate:
    left, right = st.columns([0.85, 1.15])

    with left:
        topic = st.text_input(
            "Quiz topic",
            value="retrieval augmented generation",
            placeholder="Enter a topic such as neural networks, photosynthesis, or RAG",
        )
        audience = st.selectbox(
            "Learner audience",
            ["new learners", "middle school students", "high school students", "adult learners"],
        )
        generate = st.button("Generate quiz", type="primary")

    with right:
        st.subheader("Quiz Output")
        if generate:
            with st.spinner("Running sequential chain..."):
                quiz = generate_quiz(topic, audience, temperature)
            st.session_state.history.insert(0, quiz)
            st.markdown("**Question**")
            st.info(quiz.question)
            st.markdown("**Answer Key**")
            st.success(quiz.answer)
            st.caption(quiz.source)
        else:
            st.write("Enter a topic and generate a beginner-level quiz question with a detailed answer.")

with tab_history:
    st.subheader("Generated Quiz History")
    if not st.session_state.history:
        st.info("No quiz generations yet.")
    else:
        csv_rows = [asdict(item) for item in st.session_state.history]
        csv_content = "created_at,topic,audience,question,answer,source\n"
        for row in csv_rows:
            values = [
                row["created_at"],
                row["topic"],
                row["audience"],
                row["question"].replace('"', '""'),
                row["answer"].replace('"', '""').replace("\n", "\\n"),
                row["source"],
            ]
            csv_content += ",".join(f'"{value}"' for value in values) + "\n"
        st.download_button(
            "Download history CSV",
            data=csv_content,
            file_name="quiz_generation_history.csv",
            mime="text/csv",
        )
    for index, item in enumerate(st.session_state.history, start=1):
        with st.expander(f"Quiz {index}: {item.question[:70]}"):
            st.caption(f"{item.created_at} | Topic: {item.topic} | Audience: {item.audience}")
            st.markdown("**Question**")
            st.write(item.question)
            st.markdown("**Answer Key**")
            st.write(item.answer)
            st.caption(item.source)

with tab_design:
    st.subheader("Implementation Pattern")
    st.write(
        "This app uses two focused `LLMChain` instances and a `SequentialChain` to pass the "
        "`question` output from the first chain into the answer-generation chain."
    )
    st.code(
        """question_chain = LLMChain(
    llm=llm,
    prompt=question_prompt,
    output_key="question",
)

answer_chain = LLMChain(
    llm=llm,
    prompt=answer_prompt,
    output_key="answer",
)

quiz_chain = SequentialChain(
    chains=[question_chain, answer_chain],
    input_variables=["topic", "audience"],
    output_variables=["question", "answer"],
)""",
        language="python",
    )

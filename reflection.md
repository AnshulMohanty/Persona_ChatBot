# Reflection

## What Worked

Honestly, the biggest thing that made a difference was doing proper research before touching any prompts. I went through LinkedIn posts, YouTube interviews, Quora reviews, and blog articles for all three personas. That gave me actual details to work with — Anshuman's ICPC background, Abhimanyu's compass-and-map analogy, Kshitij's "God of DSA" reputation among students. Once I had those real details in the system prompts, the responses immediately started sounding distinct.

The few-shot examples turned out to be way more useful than I expected. I initially thought writing long style descriptions would be enough, but three solid example conversations did more for consistency than paragraphs of instructions. Like, once the model saw Kshitij tracing through a binary search array step by step, it just started doing that for every DSA topic on its own.

Making the CoT (chain-of-thought) instructions different for each persona also helped a lot. Anshuman's CoT asks "do I have a relevant personal anecdote?" while Abhimanyu's asks "can I break this into components?" — same technique, but tuned per person, and it actually changes how the model reasons.

## What GIGO Taught Me

GIGO was basically the whole lesson of this project. At one point I tested a quick-and-dirty prompt — something like "You are Anshuman Singh, be helpful and friendly." The output was completely generic. You could swap any name in and it would sound the same. But when I added his specific background — the Facebook recruiting story, his brother struggling in engineering college, the ICPC competitions — the model started naturally weaving those into responses. It felt like it was actually "remembering" things.

The takeaway is pretty simple: lazy prompts give you lazy outputs. If you want something that actually sounds like a real person, you have to give the model real material to work with. There are no shortcuts here.

## What I'd Improve

If I had more time, I'd add some kind of conversation persistence — maybe localStorage so you don't lose the chat when you refresh. The suggestion chips could also be smarter, maybe updating based on what you've already talked about instead of always showing the same three. On the prompt side, I'd want to A/B test different approaches — like how many few-shot examples is optimal, or whether the CoT actually makes a measurable difference vs. just good few-shots. And ideally, I'd get feedback from someone who actually knows these people personally to see if the responses ring true.

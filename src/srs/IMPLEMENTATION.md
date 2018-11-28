# SRS Implementation
This application implements a modified version of the the SuperMemo2 algorithm. 

### SM2 Background
SM2 is an open-source algorithm that was the basis for an early version of the SuperMemo program. That was about 20 years ago. The latest version of SuperMemo operates on SM17(!!) which is avaialable for licensing. 

Despite its age, SM2 has clung to relevance thanks to its ease of implementation and "good enough" effectiveness. Though SuperMemo offers the latest and greatest computational implementation of spaced repitition, alternatives like Anki and Duolingo have helped the concept reach a wider audience, and they use SM2. 

I'm using this algorithm because it's straightforward to implement and proven to work in other similar products. The SRS logic is properly modularized so that if the platform sees success, we can choose to swap out the SRS engine for something more advanced. 

### SM2+
I found this minor improvement to the SM2 algorithm... in a blog post. It just normalizes the performance score, and adds a "percent overdue" metric to help prioritize cards that are past due. Seems pretty intuitive and doesn't mess with any of the underlying logic of the algorithm.

### Future Improvements
